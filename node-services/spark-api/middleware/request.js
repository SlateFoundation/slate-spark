'use strict';

var util = require('./../lib/util');

// This should be loaded AFTER session

module.exports = function *parseRequest(next) {
    var body = this.request.body,
        query = this.request.query,
        ctx = this;

    this.requestId = this.headers['x-nginx-request-id'];

    this.healthcheck = this.request.path === '/healthcheck';
    
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

    if (sparkpoint && !util.isMatchbookId(sparkpoint)) {
        let sparkpoint = query.sparkpoint || query.sparkpoint_code;

        query.sparkpoint_id = yield this.lookup.sparkpoint.codeToId(sparkpoint);

        if (!query.sparkpoint_id) {
            ctx.throw(new Error(`${query.sparkpoint} is an invalid sparkpoint`), 404);
        }

        delete query.sparkpoint;
        delete query.sparkpoint_code;
    }

    var section = query.section_id || query.section || query.section_code;

    if (section) {
        if (util.isGtZero(section)) {
            query.section_id = this.lookup.section.cache.codeToId[yield this.lookup.section.idToCode(section)];
        } else {
            query.section_id = yield this.lookup.section.codeToId(section);
        }

        if (!query.section_id) {
            ctx.throw(new Error(`${section} is not a valid section_id or section_code`), 404);
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
