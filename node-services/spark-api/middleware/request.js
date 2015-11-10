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

    if (query.sparkpoint_id) {
        if (!util.isMatchbookId(query.sparkpoint_id)) {
            if (util.toSparkpointId(query.sparkpoint_id)) {
                return ctx.throw(new Error(`sparkpoint code passed as a sparkpoint_id: ${query.sparkpoint_id}`), 400);
            } else {
                return ctx.throw(
                    new Error(`A sparkpoint_id is 8 characters and starts with M. You passed: ${query.sparkpoint_id}`),
                    400
                );
            }
        }
    }

    if (query.sparkpoint) {
        query.sparkpoint_id = util.toSparkpointId(query.sparkpoint);
        if (!query.sparkpoint_id) {
            ctx.throw(new Error(`${query.sparkpoint} is an invalid sparkpoint`), 404);
        }
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
            return ctx.throw(new Error('Missing required parameters: ' + missing.join(', ')), 400);
        }
    };

    yield next;
};
