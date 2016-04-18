'use strict';

var AsnStandard = require('../../lib/asn-standard');

function* getHandler() {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        sectionId = ctx.query.section_id,
        result,
        questions;

    ctx.require(['sparkpoint_id', 'section_id']);

    (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    ctx.assert(standardIds.length > 0, `No academic standards are associated with sparkpoint: ${sparkpointId}`, 404);
    ctx.assert(ctx.isTeacher, 'Only teachers can assign guiding questions', 403);

    result = yield this.pgp.one(
        //language=SQL
        `
        WITH questions AS (
            SELECT id AS resource_id,
                   '' AS creator,
                   created,
                   question,
                   gradelevel AS "gradeLevel",
                   'fusebox' AS source
              FROM fusebox_guiding_questions
             WHERE standardids ?| $1
        ),
        
        question_assignments AS (
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
                  FROM guiding_question_assignments
                 WHERE sparkpoint_id = $2
                   AND section_id = $3
                   AND resource_id = ANY(SELECT resource_id FROM questions)
             ) t GROUP BY resource_id
        )
          
        SELECT json_build_object(
            'guiding_questions',
            (
              SELECT json_agg(row_to_json(t)) FROM (
                SELECT
                  questions.*,
                  COALESCE(question_assignments.assignment, '{}'::JSON) AS assignments
                FROM questions
                  LEFT JOIN question_assignments ON question_assignments.resource_id = questions.resource_id
              ) t
            )
        ) AS json;
    `, [standardIds, sparkpointId, sectionId]);

    ctx.body = result.json;
}

module.exports = {
    get: getHandler
};

