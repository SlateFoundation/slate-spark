'use strict';

var util = require('./../lib/util');

// This should be loaded AFTER session

module.exports = function *parseRequest(next) {
    var ctx = this,
        body = ctx.request.body,
        query = ctx.request.query,
        loggingConf = this.app.context.config.logging || {};

    if (loggingConf.stdout_request_body || loggingConf.blueprint_filename) {
        ctx.original || (ctx.original = {});
        ctx.original.queryObject = ctx.request.query ? Object.assign({}, ctx.request.query) : {};
        ctx.original.query = JSON.stringify(ctx.request.query);
        ctx.original.body = JSON.stringify(ctx.request.body);
    }

    ctx.requestId = ctx.headers['x-nginx-request-id'];

    ctx.healthcheck = ctx.request.path === '/healthcheck';

    // TODO: Evaluate how ctx is used in existing endpoints; it seems like it could cause unexpected behavior
    if (!Array.isArray(body) && typeof body === 'object') {
        for (var prop in body) {
            if (typeof query[prop] === 'undefined') {
                query[prop] = body[prop];

                // A student_id in the query string supersedes one in the request body
                if (!ctx.studentId && prop === 'student_id') {
                    ctx.studentId = body[prop];
                }
            }
        }
    }

    var sparkpoint = query.sparkpoint_id || query.sparkpoint || query.sparkpoint_code;

    if (sparkpoint && !util.isMatchbookId(sparkpoint)) {
        let sparkpoint = query.sparkpoint || query.sparkpoint_code;

        query.sparkpoint_id = yield ctx.lookup.sparkpoint.codeToId(sparkpoint);

        if (!query.sparkpoint_id) {
            return ctx.throw(404, new Error(`${query.sparkpoint} is an invalid sparkpoint`), 404);
        }

        delete query.sparkpoint;
        delete query.sparkpoint_code;
    }

    if (util.isGtZero(query.section_id)) {
        query.section_id = parseInt(query.section_id, 10);

        let section_code = yield ctx.lookup.section.idToCode(query.section_id);

        if (!section_code) {
            return ctx.throw(404, `section_id ${query.section_id} could not be found`);
        }
    } else if (query.section_code || query.section) {
        let section_id = yield ctx.lookup.section.codeToId(query.section_code || query.section);

        if (!section_id) {
            return ctx.throw(404, `section_code ${query.section_code || query.section} could not be found`);
        }

        query.section_id = section_id;
    }

    if (typeof query.section === 'string') {
        delete query.section;
    }

    delete query.section_code;

    ctx.require = function(params) {
        var query = ctx.query,
            missing = params.filter(function(param) {
               return query[param] === undefined;
            });

        if (loggingConf.blueprint_filename) {
            ctx.requiredParameters = params;
        }

        if (missing.length > 0) {
            return ctx.throw(new Error('Missing required parameters: ' + missing.join(', ')), 400);
        }
    };

    yield next;
};
