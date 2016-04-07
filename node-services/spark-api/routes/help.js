'use strict';

var util = require('../lib/util.js');

/*
CREATE TABLE IF NOT EXISTS help_requests(
    id serial,
    student_id integer NOT NULL,
    section_id integer NOT NULL,
    request_type text NOT NULL,
    open_time TIMESTAMP without TIME ZONE,
    close_time TIMESTAMP without TIME ZONE,
    closed_by integer,

    PRIMARY KEY(id)
);

CREATE INDEX IF NOT EXISTS help_requests_student_id_idx ON help_requests (student_id);
CREATE INDEX IF NOT EXISTS help_requests_section_id_idx ON help_requests (section_id);
CREATE INDEX IF NOT EXISTS help_requests_section_open_time ON help_requests (open_time) WHERE open_time IS NULL;
*/


function *getHandler() {
    var ctx = this,
        helpRequests;
    
    helpRequests = yield util.selectFromRequest.call(ctx, 'help_requests');

   ctx.body = helpRequests.map(function(helpRequest) {
        helpRequest.can_delete = ctx.isTeacher || helpRequest.student_id === ctx.userId;
        return util.codifyRecord(helpRequest, ctx.lookup);
    });
}

function sqlGenerator(records, vals) {
    var ctx = this,
        tableName = 'help_requests',
        validator = ctx.validation[tableName],
        errors = [],
        sqlStatements = [],
        vals = vals || new util.Values();

    records.forEach(function(record) {
        var validationErrors;

        record = util.identifyRecordSync(record, ctx.lookup);

        // TODO: Enforce this using row-level security
        if (record.student_id !== undefined && ctx.isStudent && record.student_id !== ctx.userId) {
            ctx.throw(403, new Error(
                'The student_id of a help request cannot be changed by a student to another student.'
            ));
        }

        if (ctx.isStudent) {
            record.student_id = ctx.userId;
            if (record.section_id === undefined) {
                record.section_id = ctx.query.section_id;
            }
        }

        if (record.open_time === undefined) {
            record.open_time = new Date().toUTCString();
        }

        if (record.close === true) {
            record.close_time = new Date().toUTCString();
        }

        delete record.close;

        if (record.close_time) {
            record.closed_by = ctx.userId;
        }

        validationErrors = validator(record);

        // A PATCH can ignore any missing fields
        if (record.id !== undefined) {
            validationErrors = validationErrors.filter(error => error.indexOf('is required') === -1);
        }

        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
            errors.push({ errors: validationErrors, input: record });
        }

        if (record.id === undefined) {
            sqlStatements.push(util.recordToInsert.call(ctx, tableName, record, vals));
        } else {
            sqlStatements.push(util.recordToUpdate.call(ctx, tableName, record, vals));
        }
    });

    return {
        sql: sqlStatements,
        vals: vals,
        errors: errors
    };
}

function *postHandler() {
    var ctx = this,
        body = ctx.request.body,
        query,
        returnArray = Array.isArray(body);

    ctx.assert((returnArray && body.length > 0) || typeof body === 'object', 400,
        `${ctx.method} request body must be a single help_request object or an array of help_request objects`
    );


    if (!returnArray) {
        body = [body];
    }

    query = sqlGenerator.call(ctx, body);

    if (query.errors.length > 0) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: query.errors
        };
    }

    function aclDecorator(record) {
        if (!ctx.isStudent || ctx.userId === record.student_id) {
            record.can_delete = true;
        }

        return util.codifyRecord(record, ctx.lookup);
    }

    if (!returnArray) {
        ctx.body = aclDecorator(yield ctx.pgp.one(query.sql[0] + ' RETURNING *;', query.vals.vals));
    } else {
        ctx.body = yield ctx.pgp.many(util.queriesToReturningCte(query.sql), query.vals.vals).map(aclDecorator);
    }
}

module.exports = {
    get: getHandler,
    patch: postHandler,
    post: postHandler,
    sqlGenerator: sqlGenerator
};
