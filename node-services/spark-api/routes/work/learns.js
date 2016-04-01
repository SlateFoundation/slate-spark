'use strict';

var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    OpenEd = require('../../lib/opened'),
    util = require('../../lib/util'),
    Fusebox = require('../../lib/fusebox'),
    slack = require('../../lib/slack'),
    AsnStandard = require('../../lib/asn-standard'),
    Inliner = require('inliner');

function* getHandler() {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        studentId = ctx.isStudent ? ctx.userId : parseInt(ctx.query.student_id, 10),
        sectionId = ctx.query.section_id,
        standardIds = [],
        openedIds = [],
        playlist, opened, params, fusebox, reviews, assignments;

    ctx.assert(sparkpointId, 'a sparkpoint must be passed in the query string', 400);
    ctx.assert(sectionId, 'a section must be passed in the query string', 400);
    ctx.assert(studentId > 0, 'non-student users must pass a student_id in the query string', 400);

    (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
        var standard = new AsnStandard(asnId);
        standardIds = standardIds.concat(standard.asnIds);
        openedIds = openedIds.concat(standard.vendorIdentifiers.OpenEd);
    });

    ctx.assert(standardIds.length > 0, `No academic standards are associated with sparkpoint id: ${sparkpointId}`, 404);

    params = {
        limit: 50,
        standard: openedIds,
    };

    if (ctx.isStudent) {
        params.resource_types = ['video'/*, 'homework', 'exercise', 'game', 'question', 'other'*/];
    }

    if (openedIds.length === 0) {
        let error = new Error('OPENED: Unable to lookup vendor ids for specified standards: ' + standardIds.join(', '));
        console.warn(error);
        opened = [];
    } else {
        try {
            opened = yield OpenEd.getResources(params);
        } catch (e) {
            console.error('OPENED: ', e);
            opened = [];
        }

        if (!Array.isArray(opened.resources)) {
            console.error('OPENED: OpenEd failed to return resources!');
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
        y = 4,
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
        ), assignments AS (
           SELECT resource_id,
                  json_object_agg(
                     CASE WHEN student_id IS NULL
                          THEN 'section'
                          ELSE 'student'
                     END,
                     assignment
                  ) AS assignment
             FROM (
                   SELECT resource_id,
                          assignment,
                          student_id
                    FROM learn_assignments
                   WHERE sparkpoint_id = $2
                     AND section_id = $3
                     AND (
                               student_id = $1
                            OR student_id IS NULL
                         )
               ) t GROUP BY resource_id
       ),
       reviews AS (
          SELECT lr.*,
                 p."FirstName" AS first_name,
                 p."LastName" AS last_name
            FROM learn_reviews lr
            JOIN people p ON p."ID" = lr.student_id
           WHERE resource_id = ANY (SELECT id FROM new_learn_resources)
        GROUP BY resource_id, student_id, rating, comment, id, first_name, last_name
        ),
        reviews_json AS (
          SELECT resource_id,
                 json_object_agg(
                    student_id,
                    json_build_object(
                       'rating',
                       rating,
                       'comment',
                       comment,
                       'first_name',
                       first_name,
                       'last_name',
                       last_name
                    )
                 ) AS reviews
            FROM reviews
        GROUP BY resource_id
        ),
        ratings AS (
            SELECT resource_id,
                   round(avg(rating), 1) AS rating
              FROM reviews
          GROUP BY resource_id
        )
    `;

            sql += `
                 SELECT lr.*,
                         la.completed,
                         la.start_status = 'launched' AS launched,
                         learn_reviews.comment as comment,
                         learn_reviews.rating as rating,
                         COALESCE(assignments.assignment, '{}'::JSON) AS assignment,
                         COALESCE(reviews_json.reviews, '{}'::JSON) AS reviews,
                         COALESCE(ratings.rating, null) AS average_rating
                    FROM new_learn_resources lr
               LEFT JOIN learn_activity la
                      ON la.resource_id = lr.id
                     AND la.user_id = $1
               LEFT JOIN learn_reviews
                      ON learn_reviews.resource_id = lr.id
                     AND learn_reviews.student_id = $1
               LEFT JOIN assignments
                      ON assignments.resource_id = lr.id
               LEFT JOIN reviews_json
                      ON reviews_json.resource_id = lr.id
               LEFT JOIN ratings
                      ON ratings.resource_id = lr.id`;

        resourceIdentifiers = yield ctx.pgp.manyOrNone(
            sql,
            [studentId, sparkpointId, sectionId].concat(Object.keys(urlResourceMap)));

        resourceIdentifiers.forEach(function (resourceId) {
            var resource = urlResourceMap[resourceId.url];

            resource.rating = resource.rating || {};
            resource.rating.user = resourceId.rating || null;
            resource.rating.student = parseFloat(resourceId.average_rating)|| null;
            resource.assignment = resourceId.assignment || { student: null, section: null };
            resource.resource_id = resourceId.id;
            resource.views = resourceId.views;
            resource.launch_url = '/spark/api/work/learns/launch/' + resource.resource_id;
            resource.completed = resourceId.completed || false;
            resource.launched = resourceId.launched || false;
            resource.comment = resourceId.comment || null;
            resource.reviews = resourceId.reviews || {};
        });

        cacheSql = `
            INSERT INTO learn_playlist_cache
                        (student_id, section_id, sparkpoint_id, playlist, last_updated)
                 VALUES ($1, $2, $3, $4, current_timestamp) ON CONFLICT (sparkpoint_id, student_id, section_id) DO UPDATE
                    SET playlist = $4,
                        last_updated = current_timestamp;`;

        yield ctx.pgp.none(cacheSql, [studentId, sectionId, sparkpointId, JSON.stringify(resources)]);
    }

    ctx.body = resources;
}

function* patchHandler() {
    var resources = this.request.body,
        ctx = this,
        validationErrors,
        statements,
        vals = new util.Values(),
        recordToUpsert = util.recordToUpsert.bind(ctx),
        learnActivityRecords = [],
        learnReviewRecords = [];

    if (!Array.isArray(resources) || resources.length === 0) {
        return this.throw('Body should be an array of one or more learns.', 400);
    }

    // Prepare incoming "learn_activity" and "learn_review" record(s) for validation and transactional UPSERT
    resources.forEach(function(resource) {
        var review = null;

        if (ctx.isStudent) {
            if (typeof resource.user_id !== 'undefined' && ctx.userId != resource.user_id) {
                return ctx.throw(
                    new Error(`Tampering Evident: student_id mismatch ${ctx.userId} != ${resource.user_id}`),
                    403
                );
            } else {
                resource.user_id = ctx.userId;
            }
        }

        if (resource.rating !== undefined) {
            review || (review = { student_id: resource.user_id, resource_id: resource.resource_id });
            review.rating = resource.rating;
            delete resource.rating;
        }

        if (resource.comment !== undefined) {
            review || (review = { student_id: resource.user_id, resource_id: resource.resource_id });
            review.comment = resource.comment;
            delete resource.comment;
        }

        if (resource.completed === true) {
            resource.end_status = 'api-patch';
            resource.end_ts = new Date().toISOString();
            learnActivityRecords.push(resource);
        } else if (resource.completed === false) {
            resource.end_status = null;
            resource.end_ts = null;
            learnActivityRecords.push(resource);
        }

        if (review) {
            learnReviewRecords.push(review);
        }
    });

    validationErrors = [].concat(
        learnActivityRecords.map(function(resource) {
            var errors = ctx.validation.learn_activity(resource);

            if (errors) {
                resource.errors = errors;
                return resource;
            }
        }),
        learnReviewRecords.map(function(review) {
            var errors = ctx.validation.learn_reviews(review);

            if (errors) {
                review.errors = errors;
            }

            if (review.rating !== undefined && (review.rating <= 0 || review.rating > 10)) {
                review.errors || (review.errors = []);
                review.errors.push(`rating: must be a number between 1-10, you gave: ${review.rating}`)
            }

            if (review.errors) {
                return review;
            }
        })
    ).filter(err => err !== undefined);

    if (validationErrors.length > 0) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: validationErrors
        };
    }

    if (learnActivityRecords.length > 0) {
        statements = learnActivityRecords.map(function(resource) {
            return recordToUpsert('learn_activity', resource, vals, ['user_id', 'resource_id'])
        });
    } else {
        statements = [];
    }

    if (learnReviewRecords.length > 0) {
        statements = statements.concat(learnReviewRecords.map(function(review) {
            return recordToUpsert('learn_reviews', review, vals, ['student_id', 'resource_id']);
        }));
    }

    if (statements.length === 0) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: 'No records passed to PATCH'
        };
    }

    yield this.pgp.task(function*(pgp) {
        ctx.body = {
            success: true,
            // TODO: HACK: || [] ... not sure why we need this, investigate
            records: ((yield pgp.any(util.queriesToReturningJsonCte(statements), vals.vals)) || []).map(record => record.json)
        };
    });
}

function inlinerThunk(url) {
    return function(done) {
        new Inliner(url, function(err, html) {
            if (err) {
                return done(err);
            }

            done(null, html);
        })
    };
}

function* launchHandler(resourceId) {
    var ctx = this;

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
        try {
            ctx.body = yield inlinerThunk(learnResource.url);
        } catch (e) {
            ctx.redirect(learnResource.url);
        }
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
