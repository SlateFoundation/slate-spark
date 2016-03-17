'use strict';

var util = require('../../lib/util'),
    pluralize = require('pluralize'),
    Values = util.Values;

function *getHandler() {
    var ctx = this,
        codifyRecord = util.codifyRecord.bind(ctx),
        sectionId = ctx.query.section_id,
        sparkpointId = ctx.query.sparkpoint_id,
        sql, result;

    ctx.assert(sectionId, 400, 'section_id, section_code, or section must be passed as a query parameter');
    ctx.assert(sparkpointId, 400, 'sparkpoint_id, sparkpoint_code, or sparkpoint must be passed as a query parameter');

    sql = `
        WITH assignments AS (
            SELECT resource_id,
                   json_object_agg(coalesce(student_id :: TEXT, 'section'), assignment) AS assignments
              FROM learn_assignments
             WHERE sparkpoint_id = $1
               AND section_id = $2
          GROUP BY resource_id
        )

        SELECT (
                 SELECT playlist
                   FROM learn_playlist_cache
                  WHERE sparkpoint_id = $1
                    AND section_id = $2
               ORDER BY last_updated DESC
                  LIMIT 1
               ) AS playlist_cache,
               COALESCE((
                 SELECT json_object_agg(resource_id, assignments)
                   FROM assignments
               ), '{}'::JSON) AS assignments;
   `;

    result = yield ctx.pgp.one(sql, [sparkpointId, sectionId]);

    ctx.assert(
        Array.isArray(result.playlist_cache),
        404,
        `No playlist cache found for section_id: ${sectionId} sparkpoint_id: ${sparkpointId}`
    );

    result.playlist_cache.forEach(function(resource) {
        resource.assignments = result.assignments[resource.resource_id] || {};
        delete resource.assignment;
    });

    ctx.body = result.playlist_cache;
}

module.exports = {
    get: getHandler
};
