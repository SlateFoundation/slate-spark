var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util');

function getHandler(req, res, next) {
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        standardIds = [],
        userId = req.params['user-id'] || req.params.user_id || req.params.student_id;

    if (sparkpointIds.length === 0) {
        res.json(new JsonApiError('sparkpoint or sparkpoints parameter is required.'));
        return next();
    }

    sparkpointIds.forEach(function(sparkpointId) {
        (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
            standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
        });
    });

    if (standardIds.length === 0) {
        res.contentType = 'json';
        res.send(404, new JsonApiError('invalid sparkpoint' + (sparkpointIds.length ? 's' : '')));
        return next();
    }

    Promise.props({
        fuseboxQuestions: db(req).manyOrNone('SELECT * FROM spark1.s2_guiding_questions WHERE standardids::JSONB ?| $1', [standardIds]),
        questions: db(req).manyOrNone('SELECT id, source, question FROM conference_questions WHERE student_id = $1', [userId]),
        resources: db(req).manyOrNone('SELECT * FROM spark1.s2_conference_resources WHERE standardids::JSONB ?| $1', [standardIds]),
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
    var sparkpointId = util.toSparkpointId(req.params.sparkpoint),
        userId = req.params.student_id,
        question = req.params.question;

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
           res.json({error: error});
            return next();
        });
}

module.exports = {
    get: getHandler,
    questions: {
        post: questionPostHandler
    }
};
