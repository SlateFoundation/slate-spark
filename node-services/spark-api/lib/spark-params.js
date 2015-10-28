'use strict';

var errors = require('restify-errors'),
    lookup = require('./lookup'),
    util = require ('./util');

function sparkParamParser(options) {

    function parseSparkParams(req, res, next) {

        if (!Array.isArray(typeof req.body) && typeof req.body === 'object') {
            for (var prop in req.body) {
                if (typeof req.params[prop] === 'undefined') {
                    req.params[prop] = req.body[prop];
                }
            }
        }

        var sectionId = req.params.section || req.params['section-id'] || req.params.section_id;

        if (req.params.sparkpoint) {
            req.params.sparkpoint_id = util.toSparkpointId(req.params.sparkpoint);
        }

        if (sectionId) {
            req.params.section_id = sectionId;
        }

        req.params.section_id = req.params.section;

        return next();
    }

    return (parseSparkParams);
}

module.exports = sparkParamParser;