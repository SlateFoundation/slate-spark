'use strict';

var AsnStandard = require('../../../lib/asn-standard');

function* getHandler() {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        studentId = ctx.isStudent ? ctx.studentId : ~~ctx.query.student_id,
        sectionId = ctx.query.section_id,
        result,
        questions;

    ctx.require(['sparkpoint_id', 'section_id']);

    (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    ctx.assert(studentId > 0, 'Non-student users must pass a student_id', 400);
    ctx.assert(standardIds.length > 0, `No academic standards are associated with sparkpoint: ${sparkpointId}`, 404);

    result = yield this.pgp.one(
        //language=SQL
        `
        WITH fusebox_questions AS (
            SELECT id,
                   'fusebox'::text AS source,
                   question,
                   gradelevel AS "gradeLevel"
              FROM fusebox_guiding_questions
             WHERE standardids ?| $1
          ),
        
          questions AS (
              SELECT *, 1 AS RN
                FROM fusebox_questions
        
              UNION ALL
        
              SELECT id,
                     source::text,
                     question,
                     NULL as "gradeLevel",
                     2 AS RN
                FROM conference_questions
               WHERE student_id = $2
                 AND sparkpoint_id = $3
            ORDER BY RN, id ASC
          ),
        
          question_assignments AS (
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
                     WHERE sparkpoint_id = $3
                       AND section_id = $4
                       AND (
                                 student_id = $2
                              OR student_id IS NULL
                           )
                       AND resource_id IN (SELECT id FROM questions WHERE source = 'fusebox')
                 ) t GROUP BY resource_id
          ),
        
          resources AS (
            SELECT id,
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
                            ELSE 'student'
                       END,
                       assignment
                    ) AS assignment
               FROM (
                     SELECT resource_id,
                            assignment,
                            student_id
                      FROM conference_resource_assignments
                     WHERE sparkpoint_id = $3
                       AND section_id = $4
                       AND (
                                 student_id = $2
                              OR student_id IS NULL
                           )
                       AND resource_id IN (SELECT id FROM resources)
                 ) t GROUP BY resource_id
        )
        
        SELECT json_build_object(
            'questions',
            (
              SELECT json_agg(row_to_json(t)) FROM (
                SELECT
                  questions.*,
                  COALESCE(question_assignments.assignment, '{}'::JSON) AS assignment
                FROM questions
                  JOIN question_assignments ON question_assignments.resource_id = questions.id
              ) t
            ),
        
            'resources',
            (
              SELECT json_agg(row_to_json(t)) FROM (
                SELECT
                  resources.*,
                  COALESCE(resource_assignments.assignment, '{}'::JSON) AS assignment
                FROM resources
                  JOIN resource_assignments ON resource_assignments.resource_id = resources.id
              ) t
            ),
        
            'worksheet',
            (
                SELECT worksheet
                  FROM conference_worksheets
                 WHERE student_id = $2
                   AND sparkpoint_id = $3
           )
        ) AS json;
    `, [standardIds, studentId, sparkpointId, sectionId]);

    ctx.body = result.json;
}

module.exports = {
    get: getHandler
};
