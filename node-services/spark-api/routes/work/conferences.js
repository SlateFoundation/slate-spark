var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util');

function getHandler(req, res, next) {
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        sparkpointId = sparkpointIds[0],
        standardIds = [],
        userId = req.params['user-id'] || req.params.user_id || req.params.student_id;

    if (!sparkpointId) {
        res.statusCode = 400;
        res.json(new JsonApiError('Invalid spark point id: ' + sparkpointId));
        return next();
    }

    (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (req.session.accountLevel === 'Student') {
        userId = req.session.userId;
    }

    Promise.props({
        fuseboxQuestions: db(req).manyOrNone('SELECT * FROM spark1.s2_guiding_questions WHERE standardids::JSONB ?| $1', [standardIds]),
        questions: db(req).manyOrNone('SELECT id, source, question FROM conference_questions WHERE student_id = $1', [userId, sparkpointId]),
        resources: db(req).manyOrNone('SELECT * FROM spark1.s2_conference_resources WHERE standardids::JSONB ?| $1', [standardIds]),
        worksheet: db(req).oneOrNone('SELECT worksheet from conference_worksheets WHERE student_id = $1 AND sparkpoint_id = $2', [userId, sparkpointId])
    }).then(function(result) {
        var questions = result.fuseboxQuestions.map(function(question) {
            return {
                id: question.id,
                question: question.question,
                gradeLevel: question.gradelevel,
                source: 'fusebox'
            };
        }).concat(result.questions);

        res.json({
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
        });

        return next();
    }, function(err) {
        res.json(new JsonApiError(err));
        return next();
    });
}

function questionPostHandler(req, res, next) {
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        sparkpointId = sparkpointIds[0],
        userId = req.params.student_id,
        question = req.params.question;

    if (req.session.accountLevel === 'Student') {
        userId = req.session.userId;
    }

    if (!userId) {
        res.statusCode = 400;
        res.json({error: "userid required", body: req.body, params: req.params});
        return next();
    }

    db(req).one(`
        INSERT INTO conference_questions
                    (student_id, sparkpoint_id, source, question)
             VALUES ($1, $2, $3, $4)
          RETURNING *;
          `,
        [
            userId,
            sparkpointId,
            (req.session.accountLevel === 'Student') ? 'student' : 'teacher',
            question
        ]).then(function(record) {
            record.sparkpoint = lookup.sparkpoint.idToCode[record.sparkpoint_id];
            res.json(record);
            return next();
        }, function(error) {
           res.json({ error: error });
            return next();
        });
}

function worksheetPatchHandler(req, res, next) {
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        sparkpointId = sparkpointIds[0],
        userId = req.params.student_id,
        keys = Object.keys(req.body || {}),
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
        worksheet = {};

    if (req.session.accountLevel === 'Student') {
        userId = req.session.userId;
    }

    if (!userId) {
        res.statusCode = 400;
        res.json({error: "userid required", body: req.body, params: req.params});
        return next();
    }

    if (!sparkpointId) {
        res.statusCode = 400;
        res.json({ error: 'sparkpoint id required', params: req.params, body: req.body });
        return next();
    }

    if (invalidKeys.length > 0) {
        res.statusCode = 400;

        res.json({
            error: 'The following invalid key(s) were passed: ' + invalidKeys.join(',') + '. Valid keys are: ' + allowedKeys.join(', '),
            body: req.body,
            params: req.params
        });

        return next();
    }

    allowedKeys.forEach(function(key) {
        if (key === 'sparkpoint') {
            return;
        } else {
            worksheet[key] = req.body[key] || null;
        }
    });

    db(req).one(`
        INSERT INTO conference_worksheets
                    (student_id, sparkpoint_id, worksheet)
             VALUES ($1, $2, $3) ON CONFLICT (student_id, sparkpoint_id) DO UPDATE SET worksheet = $3
          RETURNING *;
          `,
        [
            userId,
            sparkpointId,
            worksheet
        ]).then(function(record) {
            record = record.worksheet;
            record.student_id = userId;
            record.sparkpoint = lookup.sparkpoint.idToCode[sparkpointId];
            res.json(record);
            return next();
        }, function(error) {
            res.json({error: error});
            return next();
        });
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
