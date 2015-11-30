var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../middleware/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util');

function* getHandler() {
    this.require(['sparkpoint_id', 'student_id']);

    var sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        userId = this.studentId,
        result,
        questions;

    (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (standardIds.length === 0) {
        return this.throw('No academic standards are associated with spark point id: ' + sparkpointId, 404);
    }

    result = yield Promise.props({
        fuseboxQuestions: this.pgp.manyOrNone('SELECT * FROM s2_guiding_questions WHERE standardids::JSONB ?| $1', [standardIds]),
        questions: this.pgp.manyOrNone('SELECT id, source, question FROM conference_questions WHERE student_id = $1 AND sparkpoint_id = $2', [userId, sparkpointId]),
        resources: this.pgp.manyOrNone('SELECT * FROM s2_conference_resources WHERE standardids::JSONB ?| $1', [standardIds]),
        worksheet: this.pgp.oneOrNone('SELECT worksheet from conference_worksheets WHERE student_id = $1 AND sparkpoint_id = $2', [userId, sparkpointId])
    });

    questions = result.fuseboxQuestions.map(function(question) {
        return {
            id: question.id,
            question: question.question,
            gradeLevel: question.gradelevel,
            source: 'fusebox'
        };
    }).concat(result.questions);

    this.body = {
        questions: questions,
        worksheet: result.worksheet ? result.worksheet.worksheet : null,
        resources: result.resources.map(function(resource) {
            return {
                id: resource.id,
                title: resource.title,
                url: resource.url,
                gradeLevel: resource.gradelevel,
            };
        })
    };
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

    record.sparkpoint = lookup.sparkpoint.idToCode[record.sparkpoint_id];
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
    record.sparkpoint = lookup.sparkpoint.idToCode[sparkpointId];

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
