'use strict';

var util = require('../../lib/util'),
    pluralize = require('pluralize'),
    Values = util.Values;

function *getHandler() {
    var ctx = this,
        sectionId = ctx.query.section_id,
        sparkpointId = ctx.query.sparkpoint_id,
        result;

    ctx.assert(sectionId, 400, 'section_id, section_code, or section must be passed as a query parameter');
    ctx.assert(sparkpointId, 400, 'sparkpoint_id, sparkpoint_code, or sparkpoint must be passed as a query parameter');

    result = (yield ctx.pgp.one(`
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
             WHERE sparkpoint_id = 'M10001CD'
               AND section_id = 3
        )
        
        SELECT json_build_object(
            'resources',
            (SELECT playlist FROM playlist_cache),
            'assignments',
            coalesce((SELECT json_object_agg(resource_id, assignments) FROM assignments), '{}'::JSON),
            'learns_required',
            coalesce((SELECT learns_required FROM learns_required), '{}'::JSON)
        ) AS json;
    `, [sparkpointId, sectionId])).json;

    ctx.assert(
        Array.isArray(result.resources),
        404,
        `No playlist cache found for section_id: ${sectionId} sparkpoint_id: ${sparkpointId}`
    );

    result.resources.forEach(function(resource) {
        resource.assignments = result.assignments[resource.resource_id] || {};
        delete resource.assignment;
    });

    result.learns_required.site = 5;

    ctx.body = result;
}

module.exports = {
    get: getHandler
};
