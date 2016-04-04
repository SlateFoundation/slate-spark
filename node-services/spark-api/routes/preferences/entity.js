'use strict';

var util = require('../../lib/util'),
    Values = util.Values;

function *getHandler() {
    var ctx = this,
        results = yield util.selectFromRequest.call(ctx, 'learns_required');

    ctx.body = results.map(util.codifyRecord.bind(ctx));
}

function recordToSelect(record, tableName, vals) {
    return `SELECT * FROM learns_required ${util.recordToWhere(record, vals)}`;
}

function *sqlGenerator(entity, records, vals) {
    var ctx = this,
        validator = ctx.validation.learns_required,
        errors = [],
        sqlStatements = [],
        vals = vals || new Values();

    function recordToInsert(record, vals) {
        var keys = Object.keys(record),
            values = keys.map(col => vals.push(record[col]));

        return `INSERT INTO learns_required (${keys.join(', ')}) VALUES(${values.join(', ')})`;
    }

    function recordToDelete(record, vals) {
        return `DELETE FROM learns_required ${util.recordToWhere(record, vals)}`;
    }

    for (let x = 0, len = records.length; x < len; x++) {
        let record = records[x];

        try {
            yield util.identifyRecord(record, ctx.lookup);
        } catch (e) {
            ctx.throw(400, e);
        }

        if (record.teacher_id === undefined) {
            record.teacher_id = ctx.userId;
        }

        let validationErrors = validator(record);

        delete record.assignment_date;

        if (validationErrors) {
            if (validationErrors.length === 1 && record.required === null) {
                // Requirement is null which is an implied delete, we can ignore this validation error, provided that it
                // is the only validation error
                delete record.teacher_id;

                for (var key in record) {
                    let val = record[key];

                    if (val === null) {
                        delete record[key];
                    }
                }

                sqlStatements.push(recordToDelete(record, vals));
            } else {
                let error = { errors: validationErrors };
                error[`learns_required_record`] = record;
                errors.push(error);
            }
        } else {
            sqlStatements.push(recordToInsert(record, vals));
        }
    }

    return {
        sql: sqlStatements,
        vals: vals,
        errors: errors
    };
}

function *patchHandler(entity) {
    var ctx = this,
        body = ctx.request.body,
        query,
        error;

    if (typeof body === 'object' && !Array.isArray(body)) {
        body = [body];
    }

    ctx.assert(ctx.isTeacher, 403,
        `Only teachers can set learns required; you are logged in as a: ${ctx.session.accountLevel}`
    );

    ctx.assert(Array.isArray(body) && body.length > 0, 400,
        `${ctx.method} request body must be a non-empty array of learns required.`
    );

    query = yield sqlGenerator.call(ctx, entity, body);

    if (query.errors.length > 0) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: query.errors
        };
    }

    query.sql.unshift('BEGIN');
    query.sql.push('COMMIT');

    yield ctx.pgp.none(query.sql.join(';\n') + ';', query.vals.vals)
        .catch(function(e) {
            error = { message: e.toString() };
            Object.assign(error, e);
        });

    if (error) {
        ctx.status = 500;
        return ctx.body = {
            error: [error],
            success: false
        };
    }

    ctx.body = {
        success: true
    };
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    post: patchHandler,
    sqlGenerator: sqlGenerator,
    recordToSelect: recordToSelect,
    autoRoute: false
};
