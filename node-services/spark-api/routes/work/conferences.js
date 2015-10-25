var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util');

function conferencesHandler(req, res, next) {
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        standardIds = [];

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
        questions: db(req).manyOrNone('SELECT * FROM spark1.s2_guiding_questions WHERE standardids::JSONB ?| $1', [standardIds]),
        resources: db(req).manyOrNone('SELECT * FROM spark1.s2_conference_resources WHERE standardids::JSONB ?| $1', [standardIds]),
    }).then(function(result) {
        res.json({
            questions: result.questions.map(function(question) {
                return {
                    id: question.id,
                    question: question.question,
                    gradeLevel: question.gradelevel,
                };
            }),

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

module.exports = conferencesHandler;
