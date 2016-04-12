'use strict';

var AsnStandard = require('../../lib/asn-standard');

function* getHandler() {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        sectionId = ctx.query.section_id,
        result,
        resources;

    ctx.require(['sparkpoint_id', 'section_id']);

    (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    ctx.assert(standardIds.length > 0, `No academic standards are associated with sparkpoint: ${sparkpointId}`, 404);
    ctx.assert(ctx.isTeacher, 'Only teachers can assign conference resources', 403);

    result = yield this.pgp.one(
        //language=SQL
        `
        WITH resources AS (
            SELECT id AS resource_id,
                   '' AS creator,
                   created,
                   title,
                   url,
                   gradelevel AS "gradeLevel"
              FROM fusebox_conference_resources
             WHERE standardids ?| $1
        ),
        
        resource_assignments AS (
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
                  FROM conference_resource_assignments
                 WHERE sparkpoint_id = $2
                   AND section_id = $3
                   AND resource_id = ANY(SELECT resource_id FROM resources)
             ) t GROUP BY resource_id
        )
          
        SELECT json_build_object(
            'conference_resources',
            (
              SELECT json_agg(row_to_json(t)) FROM (
                SELECT
                  resources.*,
                  COALESCE(resource_assignments.assignment, '{}'::JSON) AS assignment
                FROM resources
                  LEFT JOIN resource_assignments ON resource_assignments.resource_id = resources.resource_id
              ) t
            )
        ) AS json;
    `, [standardIds, sparkpointId, sectionId]);

    ctx.body = result.json;
}

module.exports = {
    get: getHandler
};

