'use strict';

var lookup = require('./../lib/lookup'),
    util = require('./../lib/util');

// This should be loaded AFTER session

module.exports = function *parseRequest(next) {
    var body = this.request.body,
        query = this.request.query,
        ctx = this;

    this.requestId = this.headers['x-nginx-request-id'];
    
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

    var sparkpoint = query.sparkpoint_id || query.sparkpoint || query.sparkpoint_code;

    if (!util.isMatchbookId(sparkpoint)) {
        let sparkpoint = query.sparkpoint || query.sparkpoint_code;

        query.sparkpoint_id = yield lookup.codeToId('sparkpoint', sparkpoint);

        if (!query.sparkpoint_id) {
            ctx.throw(new Error(`${query.sparkpoint} is an invalid sparkpoint`), 404);
        }

        delete query.sparkpoint;
        delete query.sparkpoint_code;
    }

    if (query.section || query.section_code) {
        let section = query.section || query.section_code;

        if (util.isGtZero(section)) {
            query.section_id = section;
        } else {
            query.section_id = yield lookup.codeToId('section', section, this.schema);
        }

        delete query.section_code;

        if (typeof query.section === 'string') {
            delete query.section;
        }
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
