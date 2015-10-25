var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util'),
    fusebox = require('../../lib/fusebox');

function assessmentsHandler(req, res, next) {
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

    db.manyOrNone(`SELECT title,
                          url,
                          vendorid,
                          gradelevel,
                          standards,
                          standardids,
                          v.name AS vendor
                     FROM spark1.s2_assessments
                     JOIN spark1.s2_vendors v
                       ON v.id = spark1.s2_assessments.vendorid
                    WHERE standardids::JSONB ?| $1`, [standardIds]).then(function (assessments) {
            res.json(assessments.map(fusebox.normalizeAssessment));
        return next();
    }, function(err) {
        res.json(new JsonApiError(err));
        return next();
    });
}

module.exports = assessmentsHandler;
