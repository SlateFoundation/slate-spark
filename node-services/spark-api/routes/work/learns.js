'use strict';

var fs = require('fs'),
    path = require('path'),
    server,
    async = require('async'),
    OpenEd = require('../../lib/opened'),
    util = require('../../lib/util'),
    JsonApiError = require('../../lib/error').JsonApiError,
    lookup = require('../../lib/lookup'),
    AsnStandard = require('../../lib/asn-standard'),
    Fusebox = require('../../lib/fusebox'),
    db = require('../../middleware/database'),
    slack = require('../../lib/slack'),
    QueryBuilder = util.QueryBuilder;

function* getHandler() {
    this.require(['sparkpoint_id', 'student_id', 'section_id']);

    var sparkpointId = this.query.sparkpoint_id,
        studentId = this.query.student_id,
        sectionId = this.query.section_id,
        standardIds = [],
        openedIds = [],
        ctx = this,
        playlist, playlistLen, x, resourceIds, activities, opened, params, fusebox, reviews;

    (lookup.entities.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
        var standard = new AsnStandard(asnId);
        standardIds = standardIds.concat(standard.asnIds);
        openedIds = openedIds.concat(standard.vendorIdentifiers.OpenEd);
    });

    if (standardIds.length === 0) {
        return this.throw('No academic standards are associated with sparkpoint id: ' + sparkpointId, 404);
    }

    // Non-student users get a cached view of the playlist
    if (!this.isStudent) {
        playlist = yield this.pgp.oneOrNone(`
            SELECT playlist
              FROM learn_playlist_cache
             WHERE student_id = $1
               AND section_id = $2
               AND sparkpoint_id = $3`,
            [studentId, sectionId, sparkpointId]);

        if (!playlist) {
            return this.body = [];
        } else {
            playlist = playlist.playlist.map(function(item) {
                item.launch_url = item.url;
                return item;
            });
            playlistLen = playlist.length;
            resourceIds = playlist.map(item => item.resource_id);
        }

        activities = yield this.pgp.manyOrNone(`
            SELECT resource_id,
                   completed,
                   start_status = 'launched' AS launched
              FROM learn_activity
             WHERE resource_id = ANY($1)
               AND user_id = $2`, [resourceIds, studentId]);

        activities.forEach(function (activity) {
            for (x = 0; x < playlistLen; x++) {
                if (activity.resource_id === playlist[x].resource_id) {
                    playlist[x].completed = activity.completed;
                    playlist[x].launched = activity.launched;
                    break;
                }
            }
        });

        reviews = yield this.pgp.manyOrNone(`
            SELECT rating,
                   comment
              FROM learn_reviews
             WHERE resource_id = ANY($1)
               AND student_id = $2`, [resourceIds, studentId]);

        reviews.forEach(function (review) {
            for (x = 0; x < playlistLen; x++) {
                if (review.resource_id === playlist[x].resource_id) {
                    playlist[x].rating = review.rating;
                    playlist[x].comment = review.comment;
                    break;
                }
            }
        });

        return this.body = playlist;
    }

    params = {
        limit: 50,
        standard: openedIds,
    };

    if (this.isStudent) {
        params.resource_types = ['video'/*, 'homework', 'exercise', 'game', 'question', 'other'*/];
    }

    if (openedIds.length === 0) {
        let error = new Error('OPENED: Unable to lookup vendor ids for specified standards: ' + standardIds.join(', '));
        console.error(error);
        // yield slack.postErrorToSlack(error, this, { standardIds: standardIds }, true);
        opened = [];
    } else {
        try {
            opened = yield OpenEd.getResources(params);
        } catch (e) {
            console.error('OPENED: ', e);
            yield slack.postErrorToSlack(e, this, null, true);
            opened = [];
        }

        if (!Array.isArray(opened.resources)) {
            yield slack.postErrorToSlack('OpenEd failed to return resources!', this, opened, false);
        }

        opened = opened.resources ? opened.resources.map(OpenEd.normalize) : [];

        // TODO: HACK: filter out premium content and non-video content until we start using SSO
        opened = opened.filter(function (resource) {
            return resource.type === 'video' && !resource.premium;
        });
    }

    if (standardIds.length === 0) {
        fusebox = [];
    } else {
        fusebox = yield Fusebox.getResources(standardIds);
    }

    var resources = opened.concat(fusebox),
        urlResourceMap = {},
        urlPlaceHolders = [],
        url,
        len,
        x,
        y = 3,
        resourceIdentifiers,
        cacheSql;

    if (resources.length > 0) {
        // TODO: determine how we will handle duplicate URLs from multiple vendors
        for (x = 0, len = resources.length; x < len; x++) {
            if (!urlResourceMap[resources[x].url]) {
                urlResourceMap[resources[x].url] = resources[x];
                urlPlaceHolders.push('($2, $' + (y++) + ')');
            }
        }

        // TODO: what kind of treatment/normalization should we do on URLs
        urlPlaceHolders.join(',\n');

        var sql = `
        WITH new_learn_resources AS (
            INSERT INTO learn_resources AS lr (sparkpoint_id, url)
            VALUES ${urlPlaceHolders}
            ON CONFLICT (url, sparkpoint_id) DO UPDATE SET views = lr.views + 1
            RETURNING url, id, views
        )
    `;

        if (studentId) {
            sql += `
            SELECT lr.*,
                   la.completed,
                   la.start_status = 'launched' AS launched,
                   learn_reviews.comment as comment,
                   learn_reviews.rating as rating
              FROM new_learn_resources lr
         LEFT JOIN learn_activity la
                ON la.resource_id = lr.id
               AND la.user_id = $1
         LEFT JOIN learn_reviews
                ON learn_reviews.resource_id = lr.id
               AND learn_reviews.student_id = $1;`;
        } else {
            sql += 'SELECT * FROM new_learn_resources;';
        }

        resourceIdentifiers = yield ctx.pgp.manyOrNone(sql, [studentId, sparkpointId].concat(Object.keys(urlResourceMap)));

        resourceIdentifiers.forEach(function (resourceId) {
            var resource = urlResourceMap[resourceId.url];

            resource.rating = resource.rating || {};
            resource.rating.user = resourceId.rating || null;

            resource.resource_id = resourceId.id;
            resource.views = resourceId.views;
            resource.launch_url = '/spark/api/work/learns/launch/' + resource.resource_id;
            resource.completed = resourceId.completed || false;
            resource.launched = resourceId.launched || false;
            resource.comment = resourceId.comment || null;
        });

        cacheSql = `
            INSERT INTO learn_playlist_cache
                        (student_id, section_id, sparkpoint_id, playlist, last_updated)
                 VALUES ($1, $2, $3, $4, current_timestamp) ON CONFLICT (sparkpoint_id, student_id, section_id) DO UPDATE
                    SET playlist = $4,
                        last_updated = current_timestamp;`;

        yield ctx.pgp.none(cacheSql, [studentId, sectionId, sparkpointId, JSON.stringify(resources)]);
    }

    this.body = resources;
}

function* patchHandler() {
    const requiredKeys = ['student_id', 'resource_id'];
    const allKeys = ['student_id', 'resource_id', 'comment', 'rating', 'completed'];

    var resources = this.request.body,
        invalidResources = [],
        validResources = [],
        _ = new QueryBuilder(),
        ctx = this,
        recordQueries = [];

    if (!Array.isArray(resources) || resources.length === 0) {
        return this.throw('Body should be an array of one or more learns.', 400);
    }

    resources.forEach(function(resource) {
        var errors = [],
            invalidKeys;

        resource.queries = [];

        if (ctx.isStudent) {
            resource.student_id = ctx.studentId;
        }

        if (isNaN(resource.resource_id)) {
            errors.push('resource_id must be numeric, you passed: ' + resource.resource_id);
        }

        if (typeof resource.completed !== 'undefined' && typeof resource.completed !== 'boolean') {
            errors.push('completed must be a boolean, you passed: ' + resource.completed);
        } else if (typeof resource.completed === 'boolean') {
            _.push('learn_activity', 'user_id', resource.student_id);
            _.push('learn_activity', 'resource_id', resource.resource_id);
            _.push('learn_activity', 'completed', resource.completed);
        }

        if (resource.rating) {
            if (isNaN(resource.rating) || resource.rating > 10 || resource.rating < 0) {
                errors.push('rating must be a number between 1 and 10, you passed: ' + resource.rating);
            } else {
                _.push('learn_reviews', 'student_id', resource.student_id);
                _.push('learn_reviews', 'resource_id', resource.resource_id);
                _.push('learn_reviews', 'rating', resource.rating);
            }
        }

        if (resource.comment) {
            if (typeof resource.comment !== 'string') {
                errors.push('comment must be a string, you passed: ' + resource.comment);
            } else {
                _.push('learn_reviews', 'student_id', resource.student_id);
                _.push('learn_reviews', 'resource_id', resource.resource_id);
                _.push('learn_reviews', 'comment', resource.comment);
            }
        }

        requiredKeys.forEach(function (key) {
            if (typeof resource[key] === 'undefined') {
                errors.push('Missing key: ' + key);
            }
        });

        invalidKeys = Object.keys(resource).filter(function (key) {
            return allKeys.indexOf(key) === -1 && key !== 'queries';
        });

        if (invalidKeys.length > 0) {
            errors.push('Unexpected key(s) encountered: ' + invalidKeys.join(', '));
        }

        if (errors.length > 0) {
            resource.errors = errors;
            invalidResources.push(resource);
            return;
        }

        if (_.tables.learn_activity) {
            let set = _.getSet('learn_activity', ['user_id', 'resource_id']);
            let values = _.getValues('learn_activity');
            let where = _.getWhere('learn_activity', ['user_id', 'resource_id']);
            _.pop('learn_activity', true);

            resource.queries.push(recordQueries.push(`UPDATE learn_activity SET ${set} WHERE ${where} RETURNING *`) - 1);
        }

        if (_.tables.learn_reviews) {
            let set = _.getSet('learn_reviews', requiredKeys);
            let values = _.getValues('learn_reviews');
            let columns = Object.keys(_.pop('learn_reviews', true).columns).join(', ');

            resource.queries.push(recordQueries.push(`
                INSERT INTO learn_reviews (${columns})
                                   VALUES (${values}) ON CONFLICT (student_id, resource_id) DO UPDATE
                                   SET ${set}
                                RETURNING *`) - 1);
        }
    });

    if (invalidResources.length > 0) {
        this.throw(
            400,
            `${invalidResources.length} invalid resource(s) and ${validResources.length} valid resource(s) were passed.\n` + JSON.stringify(
            {
                invalid: invalidResources,
                valid: validResources,
                params: this.query,
                body: this.body
            }, null, '  ')
        );
    }

    this.body = yield *util.groupQueries(recordQueries, _.values, resources, ctx, ['user_id', 'id']);
}

function* launchHandler(resourceId) {
    this.require(['student_id']);

    var origResourceId = resourceId || this.query.resource_id,
        resourceId = parseInt(origResourceId, 10),
        studentId = this.studentId,
        learnResource;

    if (isNaN(resourceId)) {
        res.send(500, 'Expected a numeric resource id, you passed: ' + origResourceId);
        return next();
    }

    yield this.pgp.none(`
        INSERT INTO learn_activity (user_id, resource_id, start_status)
             VALUES ($1, $2, $3)
        ON CONFLICT (resource_id, user_id) DO NOTHING;`, [studentId, resourceId, 'launched']);

    learnResource = yield this.pgp.one('SELECT url FROM learn_resources WHERE id = $1', resourceId);

    if (learnResource.url) {
        this.response.redirect(learnResource.url);
    } else {
        // TODO: add javascript to refresh 3 times then close the page or take you back to the playlist...
        this.throw('Failed to launch learning resource due to an unknown error. Try refreshing this ' +
            ' page. If you continue to receive this error please tell your teacher.', 500);
    }
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    launch: launchHandler
};