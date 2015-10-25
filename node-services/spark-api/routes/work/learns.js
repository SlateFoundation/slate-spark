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
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        standardIds = [],
        openedIds = [],
        userId;

    if (req.session.accountLevel === 'Student') {
        userId = req.session.userId;
    } else {
        userId = req.params['student-id'] || req.params.student_id || req.params.user_id;
        if (!userId) {
            res.send(400, 'Requests from non-student users must pass a student id, you are logged in as a: ' +
                req.session.accountLevel + ' and only included the following query parameters: ' + Object.keys(req.params)
            );
            return next();
        }
    }

    sparkpointIds.forEach(function (sparkpointId) {
        (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
            var standard = new AsnStandard(asnId);
            standardIds = standardIds.concat(standard.asnIds);
            openedIds = openedIds.concat(standard.vendorIdentifiers.OpenEd);
        });
    });

    if (sparkpointIds.length === 0) {
        res.json(new JsonApiError('sparkpoints or sparkpoint parameter is required.'));
        return next();
    }

    if (standardIds.length === 0) {
        res.contentType = 'json';
        res.send(404, new JsonApiError('Invalid sparkpoint' + (sparkpointIds.length ? 's' : '')));
        return next();
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

                    callback(null, resources.resources ? resources.resources.map(OpenEd.normalize) : []);
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
                x;

            if (resources.length > 0) {
                // TODO: determine how we will handle duplicate URLs from multiple vendors
                for (x = 0, len = resources.length; x < len; x++) {
                    if (!urlResourceMap[resources[x].url]) {
                        urlResourceMap[resources[x].url] = resources[x];
                        urlPlaceHolders.push('($' + (x + 1) + ')');
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

                if (userId) {
                    sql += `
                        SELECT lr.*,
                               la.completed,
                               la.start_status = 'launched' AS launched
                          FROM new_learn_resources lr
                     LEFT JOIN learn_activity la
                            ON la.resource_id = lr.id
                           AND la.user_id = $${++x};`;
                } else {
                    sql += 'SELECT * FROM new_learn_resources;';
                }

                db.any(sql, Object.keys(urlResourceMap).concat([userId])).then(function (resourceIdentifiers) {
                    resourceIdentifiers.forEach(function(resourceId) {
                        var resource =  urlResourceMap[resourceId.url];
                        resource.resource_id = resourceId.id;
                        resource.views = resourceId.views;
                        resource.url = resource.url;
                        resource.launch_url = '/spark/api/work/learns/launch/' + resource.resource_id;
                        resource.completed = resourceId.completed || false;
                        resource.launched = resourceId.launched || false;
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
    var origResourceId = req.params['resource-id'] || req.params.resource_id,
        resourceId = parseInt(origResourceId, 10),
        userId,
        completed = (req.params.complete || req.params.completed),
        sentArray = Array.isArray(req.body),

        resources,
        resourceValues = [];

    completed = (completed == 1 || completed == true);

    if (isNaN(resourceId)) {
        if (!sentArray) {
            res.send(400, 'Expected a numeric resource id, you passed: ' + origResourceId);
            return next();
        }
    } else if (sentArray) {
        res.send(400, 'An array of items can only be patched at the resource root, you passed a resource id: ' + origResourceId);
        return next();
    }

    if (req.session.accountLevel === 'Student') {
        userId = req.session.userId;
    } else if (req.session.accountLevel === 'Developer') {
        userId = req.params['student-id'] || req.params.student_id;
        if (!userId) {
            res.send(400, 'This is a student only endpoint. To debug you must pass a student id in the query string.');
        }
    } else if (!userId) {
        res.send(400, 'This is a student only endpoint, you are logged in as a: ' + req.session.accountLevel);
        return next();
    }

    resources = sentArray ? req.body : [{id: resourceId, completed: completed}];

    resourceValues = resources.map(function(resource) {
        // TODO: escape this
        return '(' + (resource.resource_id || resource.id) + ',' + resource.completed + ')';
    }).join(',');

    db.any(`
        UPDATE learn_activity
           SET end_status = 'api-patch',
               end_ts = now(),
               completed = r.completed
          FROM (VALUES ${resourceValues}) AS r (id, completed)
        WHERE r.id = learn_activity.resource_id
          AND user_id = $1 RETURNING *`,
    [userId]).then(function(result) {
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
    var origResourceId = req.params['resource-id'] || req.params.resource_id,
        resourceId = parseInt(origResourceId, 10),
        userId;

    if (isNaN(resourceId)) {
        res.send(500, 'Expected a numeric resource id, you passed: ' + origResourceId);
        return next();
    }

    // DEBUG ONLY
    if (!req.session) {
        req.session = {};
        req.session.accountLevel = 'Developer';
    }
    // END DEBUG ONLY

    if (req.session.accountLevel === 'Student') {
        userId = req.session.userId;
    } else if (req.session.accountLevel === 'Developer') {
        userId = req.params['student-id'] || req.params.student_id;
        if (!userId) {
            res.send(400, 'This is a student only endpoint. To debug you must pass a student id in the query string.');
        }
    } else if (!userId) {
        res.send(400, 'This is a student only endpoint, you are logged in as a: ' + req.session.accountLevel);
        return next();
    }

    db.none(`
        INSERT INTO learn_activity (user_id, resource_id, start_status)
             VALUES ($1, $2, $3)
        ON CONFLICT (resource_id, user_id) DO NOTHING;`, [userId, resourceId, 'launched']).then(function(data) {
            db.one('SELECT url FROM learn_resources WHERE id = $1', resourceId).then(function(data) {
                if (data.url) {
                    return res.redirect(data.url, next);
                } else {
                    res.send(500, 'Failed to launch learning resource due to an unknown error. Try refreshing this ' +
                                  ' page. If you continue to receive this error please tell your teacher.');
                    return next();
                }
            }, function (reason) {
                res.send(500, reason);
                return next();
            });
    }, function (error) {
        res.send(500, reason);
        return next();
    });
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    launch: launchHandler
};