var restify = require('restify'),
    fs = require('fs'),
    path = require('path'),
    server,
    async = require('async'),
    OpenEd = require('../../lib/opened'),
    util = require('../../lib/util'),
    JsonApiError = require('../../lib/error').JsonApiError,
    lookup = require('../../lib/lookup'),
    AsnStandard = require('../../lib/asn-standard'),
    Fusebox = require('../../lib/fusebox'),
    Newsela = require('../../lib/newsela'),
    db = require('../../lib/database');

function getHandler(req, res, next) {
    if (util.requireParams(['sparkpoint_id', 'student_id', 'section_id'], req, res)) {
        return next();
    }

    var sparkpointId = req.params.sparkpoint_id,
        studentId = req.params.student_id,
        sectionId = req.params.sectionid,
        standardIds = [],
        openedIds = [];

    (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
        var standard = new AsnStandard(asnId);
        standardIds = standardIds.concat(standard.asnIds);
        openedIds = openedIds.concat(standard.vendorIdentifiers.OpenEd);
    });

    if (standardIds.length === 0) {
        res.statusCode = 404;
        res.json({ error: 'No academic standards are associated with sparkpoint id: ' + sparkpointId, params: req.params });
        return next();
    }

    // Non student users get a cached view of the playlist
    if (!req.isStudent) {
        db(req).oneOrNone(`
            SELECT playlist
              FROM learn_playlist_cache
             WHERE student_id = $1
               AND section_id = $2
               AND sparkpoint_id = $3`,
            [studentId, sectionId, sparkpointId]).then(function (playlist) {
                var playlistLen;

                if (playlist && playlist.playlist) {
                    playlistLen = playlist.playlist.length;
                    playlist = playlist.playlist;

                    db(req).any(`
                        SELECT resource_id,
                               completed,
                               start_status = 'launched' AS launched
                          FROM learn_activity
                         WHERE resource_id = ANY($1)
                           AND user_id = $2`, [playlist.map(item => item.resource_id), studentId]).then(function(activities) {
                        if (activities) {
                            activities.forEach(function(activity) {
                               for (var x = 0; x < playlistLen; x++) {
                                   if (activity.resource_id === playlist[x].resource_id) {
                                       playlist[x].completed = activity.completed;
                                       playlist[x].launched = activity.launched;
                                       break;
                                   }
                               }
                            });

                            res.json(playlist);
                        } else {
                            res.send('nothing');
                        }

                        return next();
                    }, function(error) {
                        res.json(playlist.playlist);
                        next();
                    });
                } else {
                    res.json([]);
                    return next();
                }
            }, function (err) {
                res.statusCode = 500;
                res.json(err);
                next();
            });
        return;
    }

    async.parallel({
            opened: function (callback) {
                var params = {
                    limit: 50,
                    standard: openedIds,
                };

                if (req.session && req.session.accountLevel === 'Student') {
                    params.resource_types = ['video', 'homework', 'exercise', 'game', 'question', 'other'];
                }

                if (openedIds.length === 0) {
                    return callback(null, []);
                }

                OpenEd.getResources(params, function (err, resources) {
                    if (err) {
                        console.error('Error getting OpenEd resources: ' + err);
                        return callback(null, []);
                    }

                    resources = resources.resources ? resources.resources.map(OpenEd.normalize) : [];

                    resources = resources.filter(function(resource) {
                        return resource.type === 'video' && !resource.premium;
                    });

                    callback(null, resources);
                });
            },

            fusebox: function (callback) {
                if (standardIds.length === 0) {
                    callback(null, []);
                }

                Fusebox.getResources(standardIds, callback);
            },

            /*newsela: function (callback) {
                var standardCodes;

                if (standardIds.length === 0) {
                    callback(null, []);
                }

                standardCodes = util.toStandardCodes(standardIds).filter(function (code) {
                    return code.indexOf('CCSS.ELA-Literacy.CCRA.R') === 0;
                });

                if (standardCodes.length > 0) {
                    Newsela.getResources(standardCodes, function (err, resources) {
                        if (err) {
                            return callback(null, []);
                        }

                        callback(null, []);
                    });
                }
            }*/
        },

        function (err, results) {

            var resources = results.opened.concat(results.fusebox),
                urlResourceMap = {},
                urlPlaceHolders = [],
                url,
                len,
                x,
                y = 1;

            if (resources.length > 0) {
                // TODO: determine how we will handle duplicate URLs from multiple vendors
                for (x = 0, len = resources.length; x < len; x++) {
                    if (!urlResourceMap[resources[x].url]) {
                        urlResourceMap[resources[x].url] = resources[x];
                        urlPlaceHolders.push('($' + (y++) + ')');
                    }
                }

                // TODO: what kind of treatment/normalization should we do on URLs
                urlPlaceHolders.join(',\n');

                var sql = `
                    WITH new_learn_resources AS (
                        INSERT INTO learn_resources AS lr (url)
                        VALUES ${urlPlaceHolders}
                        ON CONFLICT (url) DO UPDATE SET views = lr.views + 1
                        RETURNING url, id, views
                    )
                `;

                if (studentId) {
                    sql += `
                        SELECT lr.*,
                               la.completed,
                               la.start_status = 'launched' AS launched
                          FROM new_learn_resources lr
                     LEFT JOIN learn_activity la
                            ON la.resource_id = lr.id
                           AND la.user_id = $${y};`;
                } else {
                    sql += 'SELECT * FROM new_learn_resources;';
                }

                db(req).any(sql, Object.keys(urlResourceMap).concat([studentId])).then(function (resourceIdentifiers) {
                    var cacheSql;

                    resourceIdentifiers.forEach(function(resourceId) {
                        var resource =  urlResourceMap[resourceId.url];

                        resource.resource_id = resourceId.id;
                        resource.views = resourceId.views;
                        resource.url = resource.url;
                        resource.launch_url = '/spark/api/work/learns/launch/' + resource.resource_id;
                        resource.completed = resourceId.completed || false;
                        resource.launched = resourceId.launched || false;
                    });

                    cacheSql = `
                        INSERT INTO learn_playlist_cache
                                    (student_id, section_id, sparkpoint_id, playlist, last_updated)
                             VALUES ($1, $2, $3, $4, current_timestamp) ON CONFLICT (sparkpoint_id, student_id, section_id) DO UPDATE
                                SET playlist = $4,
                                    last_updated = current_timestamp;`;

                    db(req).none(cacheSql, [studentId, sectionId, sparkpointIds[0], JSON.stringify(resources)]).then(function() {}, function(err) {
                        console.error('Error caching student learn playlist: ', cacheSql);
                        console.error(err);
                    });

                    res.json(resources);
                    return next();

                }, function (err) {
                    res.send(500, { error: err });
                    return next();
                });
            } else {
                res.json(resources);
                return next();
            }
        });
}

function patchHandler(req, res, next) {
    if (util.requireParams(['student_id'], req, res)) {
        return next();
    }

    var origResourceId = req.params['resource-id'] || req.params.resource_id,
        resourceId = parseInt(origResourceId, 10),
        studentId = req.params.student_id,
        completed = (req.params.complete || req.params.completed).toString(),
        sentArray = Array.isArray(req.body),
        resources,
        resourceValues = [];

    completed = (completed == 1 || completed == true);

    if (isNaN(resourceId)) {
        if (!sentArray) {
            res.statusCode = 400;
            res.json({ error: 'Expected a numeric resource id, you passed: ' + origResourceId, params: req.params });
            return next();
        }
    } else if (sentArray) {
        res.statusCode = 400;
        res.json({
            error: 'An array of items can only be patched at the resource root, you passed a resource id: ' + origResourceId,
            params: req.params
        });
        return next();
    }

    resources = sentArray ? req.body : [{id: resourceId, completed: completed}];

    resourceValues = resources.map(function(resource) {
        // TODO: escape this
        return '(' + (resource.resource_id || resource.id) + ',' + resource.completed + ')';
    }).join(',');

    db(req).any(`
        UPDATE learn_activity
           SET end_status = 'api-patch',
               end_ts = now(),
               completed = r.completed
          FROM (VALUES ${resourceValues}) AS r (id, completed)
        WHERE r.id = learn_activity.resource_id
          AND user_id = $1 RETURNING *`,
    [studentId]).then(function(result) {
        if (sentArray) {
            res.json(result.map(function(resource) { return { resource_id: resource.id, completed: resource.completed }; }));
        } else {
            res.json(result[0]);
        }
        return next();
    }, function(err) {
        res.send(500, err);
        return next();
    });
}

function launchHandler(req, res, next) {
    if (util.requireParams(['student_id'], req, res)) {
        return next();
    }

    var origResourceId = req.params['resource-id'] || req.params.resource_id,
        resourceId = parseInt(origResourceId, 10),
        studentId = req.params.student_id;

    if (isNaN(resourceId)) {
        res.send(500, 'Expected a numeric resource id, you passed: ' + origResourceId);
        return next();
    }

    db(req).none(`
        INSERT INTO learn_activity (user_id, resource_id, start_status)
             VALUES ($1, $2, $3)
        ON CONFLICT (resource_id, user_id) DO NOTHING;`, [studentId, resourceId, 'launched']).then(function(data) {
            db(req).one('SELECT url FROM learn_resources WHERE id = $1', resourceId).then(function(data) {
                if (data.url) {
                    return res.redirect(data.url, next);
                } else {
                    // TODO : add javascript to refresh 3 times then close the page or take you back to the playlist...
                    res.send(500, 'Failed to launch learning resource due to an unknown error. Try refreshing this ' +
                                  ' page. If you continue to receive this error please tell your teacher.');
                    return next();
                }
            }, function (reason) {
                res.send(500, reason);
                return next();
            });
    }, function (error) {
        res.send(500, error);
        return next();
    });
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    launch: launchHandler
};