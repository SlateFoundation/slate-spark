'use strict';

var AsnStandard = require('../../lib/asn-standard');

function *getHandler() {
    var ctx = this,
        sectionId = ctx.query.section_id,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        result;

    ctx.assert(sectionId, 400, 'section_id, section_code, or section must be passed as a query parameter');
    ctx.assert(sparkpointId, 400, 'sparkpoint_id, sparkpoint_code, or sparkpoint must be passed as a query parameter');

    (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    ctx.assert(standardIds.length > 0, `No academic standards are associated with sparkpoint: ${sparkpointId}`, 404);

    ctx.body = (yield ctx.pgp.one(`
        WITH resources AS (
          SELECT id AS resource_id,
                 created,
                 question,
                 '' AS created_by
            FROM fusebox_guiding_questions
           WHERE standardids ?| $1
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
                    FROM guiding_question_assignments
                   WHERE sparkpoint_id = $2
                     AND section_id = $3
               ) t GROUP BY resource_id
        )
        
        SELECT json_build_object(
          'resources',
          (SELECT json_agg(resources) FROM resources),
          'assignments',
          COALESCE((SELECT json_object_agg(resource_id, assignment) FROM assignments), '{}'::JSON)
        ) AS json;
    `, [standardIds, sparkpointId, sectionId])).json;
}

module.exports = {
    get: getHandler
};
