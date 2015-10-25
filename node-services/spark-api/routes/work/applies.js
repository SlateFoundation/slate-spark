var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util');

function appliesHandler(req, res, next) {
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        standardIds = [];

    if (sparkpointIds.length === 0) {
        res.json(new JsonApiError('sparkpoint or sparkpoints parameter is required.'));
        return next();
    }

    sparkpointIds.forEach(function (sparkpointId) {
        (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
            standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
        });
    });

    if (standardIds.length === 0) {
        res.contentType = 'json';
        res.send(404, new JsonApiError('Invalid sparkpoint' + (sparkpointIds.length ? 's' : '')));
        return next();
    }

    db(req).manyOrNone('SELECT * FROM spark1.s2_apply_projects WHERE standardids::JSONB ?| $1', [standardIds]).then(function (result) {
        res.json(result.map(function (apply) {
            return {
                id: apply.id,
                title: apply.title,
                instructions: apply.instructions,
                gradeLevel: apply.gradeLevel,
                dok: apply.dok,
                sparkpointIds: util.toSparkpointIds(apply.standardids),
                sparkpointCodes: util.toSparkpointCodes(apply.standardids),
                standardCodes: util.toStandardCodes(apply.standardids),
                todos: (apply.todos || []).filter(todo => todo !== '\n').map(todo => todo.toString().trim()),
                links: (apply.links || []).filter(link => link !== '\n').map(link => link.toString().trim()),
                timeEstimate: apply.timestimate,
                metadata: apply.metadata === '""' ? {} : apply.metadata
            };
        }));
        return next();
    }, function (err) {
        res.json(new JsonApiError(err));
        return next();
    });
}

module.exports = appliesHandler;
