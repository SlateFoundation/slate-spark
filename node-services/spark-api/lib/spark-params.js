'use strict';

var errors = require('restify-errors'),
    lookup = require('./lookup');

function sparkParamParser(options) {

    function parseSparkParams(req, res, next) {

        var sectionId = req.params.section || req.params['section-id'] || req.params.section_id;

        if (req.params.sparkpoint) {
            req.params.sparkpoint_id = lookup.sparkpoint.codeToId[req.params.sparkpoint];
        }

        if (sectionId) {
            req.params.section_id = sectionId;
        }

        return next();
    }

    return (parseSparkParams);
}

module.exports = sparkParamParser;