'use strict';

var AsnStandard = require('../../lib/asn-standard');

function* getHandler() {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        sectionId = ctx.query.section_id,
        result,
        applies;

    ctx.require(['sparkpoint_id', 'section_id']);

    (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    ctx.assert(standardIds.length > 0, `No academic standards are associated with sparkpoint: ${sparkpointId}`, 404);
    ctx.assert(ctx.isTeacher, 'Only teachers can assign applies', 403);

    result = yield this.pgp.one(
        //language=SQL
        `
        WITH applies AS (
            SELECT fusebox_apply_projects.*,
                   id AS resource_id,
                   '' AS creator,
                   created,
                   title,
                   dok,
                   gradelevel AS "gradeLevel"
              FROM fusebox_apply_projects
             WHERE standardids ?| $1
        ),
        
        apply_assignments AS (
            SELECT resource_id,
                json_object_agg(
                   CASE WHEN student_id IS NULL
                        THEN 'section'
                        ELSE student_id::TEXT
                   END,
                   assignment
                ) AS assignment
            FROM (
                 SELECT resource_id,
                        assignment,
                        student_id
                  FROM apply_assignments
                 WHERE sparkpoint_id = $2
                   AND section_id = $3
                   AND resource_id = ANY(SELECT resource_id FROM applies)
             ) t GROUP BY resource_id
        )
          
        SELECT json_build_object(
            'applies',
            COALESCE((
              SELECT json_agg(row_to_json(t)) FROM (
                SELECT
                  applies.*,
                  COALESCE(apply_assignments.assignment, '{}'::JSON) AS assignment
                FROM applies
                  LEFT JOIN apply_assignments ON apply_assignments.resource_id = applies.resource_id
              ) t
            ), '[]'::JSON)
        ) AS json;
    `, [standardIds, sparkpointId, sectionId]);

    ctx.body = result.json;
}

module.exports = {
    get: getHandler
};

