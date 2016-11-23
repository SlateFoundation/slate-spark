'use strict';

const util = require('../../lib/util');
const AsnStandard = require('../../lib/asn-standard');
const recordToModel = require('../work/modules/index.js').recordToModel;

function* getHandler() {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        sectionId = ~~ctx.query.section_id,
        isLesson = util.isLessonSparkpoint(sparkpointId),
        sparkpointIds = !isLesson ? [sparkpointId] : [],
        questions,
        lesson;

    ctx.require(['sparkpoint_id', 'section_id']);

    if (isLesson) {
        try {
            lesson = recordToModel(yield ctx.pgp.one('SELECT * FROM modules WHERE sparkpoint_id = $1', [sparkpointId]));
            sparkpointIds = lesson.sparkpoints.map(sparkpoint => sparkpoint.id).concat(sparkpointId);
            standardIds.push(sparkpointId);
        } catch (e) {
            return ctx.throw(404, e);
        }
    }

    sparkpointIds.forEach(function(sparkpointId) {
        (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
            standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
        });
    });

    ctx.assert(ctx.isTeacher, 'Only teachers can assign guiding questions', 403);

    questions = (yield this.pgp.one(/*language=SQL*/ `
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
    `, [standardIds, sparkpointId, sectionId])).json;

    questions.lesson = lesson || null;
    ctx.body = questions;
}

module.exports = {
    get: getHandler
};

