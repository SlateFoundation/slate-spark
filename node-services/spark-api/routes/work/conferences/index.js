'use strict';

var AsnStandard = require('../../../lib/asn-standard'),
    recordToModel = require('../modules/index.js').recordToModel,
    util = require('../../../lib/util');

function* getHandler() {
    var ctx = this,
        sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        studentId = ctx.isStudent ? ctx.studentId : ~~ctx.query.student_id,
        sectionId = ~~this.query.section_id,
        isLesson = util.isLessonSparkpoint(sparkpointId),
        sparkpointIds = !isLesson ? [sparkpointId] : [],
        result,
        question,
        lesson;

    ctx.require(['sparkpoint_id', 'section_id']);

    if (isLesson) {
        try {
            lesson = recordToModel(yield ctx.pgp.one('SELECT * FROM modules WHERE sparkpoint_id = $1', [sparkpointId]));
            sparkpointIds = lesson.sparkpoints.map(sparkpoint => sparkpoint.id).concat(sparkpointId);
            standardIds.push(sparkpointId);
        } catch (e) {
            return ctx.throw(404, new Error(`Unable to find lesson template for ${sparkpointId}`));
        }
    }

    sparkpointIds.forEach(function(sparkpointId) {
        (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
            standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
        });
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
                       AND resource_id = ANY(SELECT id FROM questions WHERE source = 'fusebox')
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
                       AND resource_id = ANY (SELECT id FROM resources)
                 ) t GROUP BY resource_id
        )
        
        SELECT json_build_object(
            'questions',
            (
              SELECT json_agg(row_to_json(t)) FROM (
                SELECT
                  questions.*,
                  (CASE WHEN questions.source = 'fusebox' THEN questions.id ELSE null END) AS resource_id,
                  COALESCE(question_assignments.assignment, '{}'::JSON) AS assignment
                FROM questions
           LEFT JOIN question_assignments ON question_assignments.resource_id = questions.id
              ) t
            ),
        
            'resources',
            (
              SELECT json_agg(row_to_json(t)) FROM (
                SELECT
                  resources.*,
                  resources.id AS resource_id,
                  COALESCE(resource_assignments.assignment, '{}'::JSON) AS assignment
                FROM resources
           LEFT JOIN resource_assignments ON resource_assignments.resource_id = resources.id
              ) t
            ),
        
            'worksheet',
            (
                SELECT worksheet
                  FROM conference_worksheets
                 WHERE student_id = $2
                   AND sparkpoint_id = $3
                   AND section_id = $4
           ),
           
           'module',
           (
                SELECT row_to_json(modules)
                  FROM modules
                 WHERE sparkpoint_id = $3
           )
        ) AS json;
    `, [standardIds, studentId, sparkpointId, sectionId]);

    if (result.json.module) {
        result.json.module = recordToModel(result.json.module);
    }

    ctx.body = result.json;
}

module.exports = {
    get: getHandler
};
