'use strict';

var AsnStandard = require('../../lib/asn-standard');

function* getHandler() {
    this.require(['sparkpoint_id', 'student_id']);

    var sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        userId = this.studentId,
        result,
        questions;

    (this.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (standardIds.length === 0) {
        return this.throw('No academic standards are associated with spark point id: ' + sparkpointId, 404);
    }

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
            SELECT *
              FROM fusebox_questions

            UNION ALL

            SELECT id,
                   source::text,
                   question,
                   NULL as "gradeLevel"
              FROM conference_questions
             WHERE student_id = $2
               AND sparkpoint_id = $3
        ),

        resources AS (
          SELECT id,
                 title,
                 url,
                 gradelevel AS "gradeLevel"
            FROM fusebox_conference_resources
           WHERE standardids ?| $1
        )

        SELECT json_build_object(
            'questions',
            (
               SELECT json_agg(row_to_json(questions))
                 FROM questions
            ),

            'resources',
            (
              SELECT json_agg(row_to_json(resources))
                FROM resources
            ),

            'worksheet',
            (
                SELECT worksheet
                  FROM conference_worksheets
                 WHERE student_id = $2
                   AND sparkpoint_id = $3
           )
        ) AS json;
    `, [standardIds, userId, sparkpointId]);

    this.body = result.json;
}

function* questionPostHandler() {
    this.require(['sparkpoint_id', 'student_id', 'question']);

    var sparkpointId = this.query.sparkpoint_id,
        studentId = this.studentId,
        question = this.query.question,
        record;

    record = yield this.pgp.one(`
        INSERT INTO conference_questions
                    (student_id, sparkpoint_id, source, question)
             VALUES ($1, $2, $3, $4)
          RETURNING *;
          `,
        [
            studentId,
            sparkpointId,
            this.isStudent ? 'student' : 'teacher',
            question
        ]);

    record.sparkpoint = yield this.lookup.sparkpoint.idToCode(record.sparkpoint_id);

    this.body = record;
}

function* worksheetPatchHandler(req, res, next) {
    this.require(['sparkpoint_id', 'student_id']);

    var sparkpointId = this.query.sparkpoint_id,
        studentId = this.studentId,
        body = this.request.body,
        keys = Object.keys(body || {}),
        allowedKeys = [
            'sparkpoint',
            'restated',
            'steps',
            'example_1',
            'example_2',
            'example_3',
            'peer_id',
            'peer_feedback'
         ],
        invalidKeys = keys.filter(key => allowedKeys.indexOf(key) === -1),
        worksheet = {},
        record;

    if (invalidKeys.length > 0) {
        return this.throw(`The following invalid key(s) were passed: ${invalidKeys.join(',')}. Valid keys are: ${allowedKeys.join(', ')}`, 400);
    }

    allowedKeys.forEach(function(key) {
        if (key === 'sparkpoint') {
            return;
        } else {
            worksheet[key] = body[key] || null;
        }
    });

    record = yield this.pgp.one(`
        INSERT INTO conference_worksheets
                    (student_id, sparkpoint_id, worksheet)
             VALUES ($1, $2, $3) ON CONFLICT (student_id, sparkpoint_id) DO UPDATE SET worksheet = $3
          RETURNING *;
          `,
        [
            studentId,
            sparkpointId,
            worksheet
        ]);


    record = record.worksheet;
    record.student_id = studentId;
    record.sparkpoint = yield this.lookup.sparkpoint.idToCode(sparkpointId);

    this.body = record;
}

module.exports = {
    get: getHandler,

    questions: {
        post: questionPostHandler
    },

    worksheet: {
        patch: worksheetPatchHandler
    }
};
