'use strict';

var lookup = require('./../lib/lookup'),
    util = require('./../lib/util');

// This should be loaded AFTER session

module.exports = function *parseRequest(next) {
    var body = this.request.body,
        query = this.request.query,
        ctx = this;
    
    if (!Array.isArray(body) && typeof body === 'object') {
        for (var prop in body) {
            if (typeof query[prop] === 'undefined') {
                query[prop] = body[prop];

                // A student_id in the query string supersedes one in the request body
                if (!this.studentId && prop === 'student_id') {
                    this.studentId = body[prop];
                }
            }
        }
    }

    if (query.sparkpoint) {
        query.sparkpoint_id = util.toSparkpointId(query.sparkpoint);
    }

    // TODO: migrate database schemas to section_id, right now section is stored as section_id in postgresql
    if (query.section) {
        query.section_id = query.section;
    }

    this.require = function(params) {
        var query = ctx.query,
            missing = params.filter(function(param) {
               return query[param] === undefined;
            });

        if (missing.length > 0) {
            return ctx.throw('Missing required parameters: ' + missing.join(', '), 400);
        }
    };

    yield next;
};
