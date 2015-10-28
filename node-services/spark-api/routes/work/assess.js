'use strict';

var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util'),
    fusebox = require('../../lib/fusebox');

function getHandler(req, res, next) {
    if (util.requireParams(['sparkpoint_id', 'student_id'], req, res)) {
        return next();
    }

    var sparkpointId = req.params.sparkpoint_id,
        standardIds = [];

    (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (standardIds.length === 0) {
        res.statusCode = 404;
        res.json({ error: 'No academic standards are associated with sparkpoint id: ' + sparkpointId, params: req.params });
        return next();
    }

    Promise.props({
        assessments: db(req).manyOrNone(`SELECT title,
                          url,
                          vendorid,
                          gradelevel,
                          standards,
                          standardids,
                          v.name AS vendor
                     FROM spark1.s2_assessments
                     JOIN spark1.s2_vendors v
                       ON v.id = spark1.s2_assessments.vendorid
                    WHERE standardids::JSONB ?| $1`, [standardIds]),
        reflection: db(req).oneOrNone(`SELECT reflection FROM assesses WHERE sparkpoint_id = $1 and student_id = $2`, [sparkpointId, req.studentId])
    }).then(function(result) {
        var assessments = result.assessments ? result.assessments.map(fusebox.normalizeAssessment) : [];

        res.json({
            assessments: assessments,
            reflection: result.reflection ? result.reflection.reflection : ''
        });

        return next();
    }, function(err) {
        res.statusCode = 500;
        res.json(new JsonApiError(err));
        return next();
    });
}

function patchHandler(req, res, next) {
    if (util.requireParams(['sparkpoint_id', 'student_id', 'reflection'], req, res)) {
        return next();
    }

    var sparkpointId = req.params.sparkpoint_id,
        reflection = req.params.reflection;

    db(req).one(`
            INSERT INTO assesses
                 VALUES ($1, $2, $3) ON CONFLICT (student_id, sparkpoint_id) DO UPDATE
                    SET reflection = $3
              RETURNING *`,
        [
            req.studentId,
            sparkpointId,
            reflection
        ]).then(function(assess) {
        res.json(assess);
        return next();
    }, function(error) {
        res.statusCode = 500;
        res.json({error: error});
        return next();
    });
}

module.exports = {
    get: getHandler,
    patch: patchHandler
};