var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util'),
    fusebox = require('../../lib/fusebox');

function assessmentsHandler(req, res, next) {
    if (util.requireParams(['sparkpoint_id'], req, res)) {
        return next();
    }

    var sparkpointId = req.params.sparkpoint_id,
        standardIds = [];

    (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (standardIds.length === 0) {
        res.statusCode = 404;
        res.json({ error: 'No academic standards are associated with sparkpoint id: ' + sparkpointId, params: req.params });
        return next();
    }

    db(req).manyOrNone(`SELECT title,
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
