'use strict';

var util = require('../../lib/util');

function *getHandler(next) {
    var ctx = this,
        sectionId = ctx.query.section_id,
        sparkpointId = ctx.query.sparkpoint_id,
        result;

    ctx.assert(sectionId, 400, 'section_id, section_code, or section must be passed as a query parameter');
    ctx.assert(sparkpointId, 400, 'sparkpoint_id, sparkpoint_code, or sparkpoint must be passed as a query parameter');

    // HACK: call /work/learns to make sure that the playlist is cached/up to date
    ctx.query.student_id = ctx.userId;
    yield require('../work/learns').get.call(ctx, next);
    delete ctx.query.student_id;

    result = (yield ctx.pgp.one(/*language=SQL*/ `
        WITH playlist_cache AS (
            SELECT playlist
              FROM learn_playlist_cache
             WHERE sparkpoint_id = $1
               AND section_id = $2
          ORDER BY last_updated DESC
             LIMIT 1
        ), assignments AS (
            SELECT resource_id,
                   json_object_agg(
                       coalesce(student_id::TEXT, 'section'),
                       assignment
                   ) AS assignments
              FROM learn_assignments
             WHERE sparkpoint_id = $1
               AND section_id = $2
          GROUP BY resource_id
        ), learns_required AS (
            SELECT json_object_agg(
                      coalesce(student_id::text, 'section'),
                      required
                   ) AS learns_required
              FROM learns_required
             WHERE sparkpoint_id = $1
               AND section_id = $2
        ), learn_discussions AS (
          SELECT id,
                 body,
                 ts,
                 author_id,
                 resource_id
            FROM learn_discussions
           WHERE resource_id = ANY(
             SELECT (resource->>'resource_id')::INTEGER
               FROM (
                  SELECT jsonb_array_elements(playlist) AS resource
                    FROM playlist_cache
               ) unrolled_playlist
           )
           ORDER BY id
        )

        SELECT json_build_object(
            'learns',
            (SELECT playlist FROM playlist_cache),
            'assignments',
            coalesce((SELECT json_object_agg(resource_id, assignments) FROM assignments), '{}'::JSON),
            'learns_required',
            coalesce((SELECT learns_required FROM learns_required), '{}'::JSON),
            'discussions',
            coalesce((SELECT json_agg(learn_discussions) FROM learn_discussions), '{}'::JSON)
        ) AS json;
    `, [sparkpointId, sectionId])).json;

    ctx.assert(
        Array.isArray(result.learns),
        404,
        `No playlist cache found for section_id: ${sectionId} sparkpoint_id: ${sparkpointId}`
    );

    result.learns.forEach(function(resource) {
        resource.assignments = result.assignments[resource.resource_id] || {};
        delete resource.assignment;

        // HACK: Learning targets should appear as "required-first" unless they are set to something else
        if (resource.title.toLowerCase().indexOf('learning target') !== -1) {
            resource.assignments.section = resource.assignments.section || 'required-first';
        }
    });

    for (let resourceId in result.discussions) {
        let discussion = result.discussions[resourceId];
        util.namifyRecord(discussion, ctx.lookup);
    }

    result.learns_required.site = 5;

    delete result.assignments;

    ctx.body = result;
}

module.exports = {
    get: getHandler
};
