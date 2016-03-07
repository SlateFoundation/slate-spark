'use strict';

var util = require('../../lib/util'),
    pluralize = require('pluralize'),
    Values = util.Values;

function *getHandler(entity) {
    var tableName = `${pluralize.singular(entity)}_assignments`,
        results = yield util.selectFromRequest.call(this, tableName);

    this.body = results.map(util.codifyRecord.bind(this));
}

function recordToSelect(record, tableName, vals) {
    return `SELECT * FROM ${tableName} ${util.recordToWhere(record, vals)}`;
}

function sqlGenerator(entity, records, vals) {
    var tableName = `${pluralize.singular(entity)}_assignments`,
        validator = this.validation[tableName],
        errors = [],
        sqlStatements = [],
        vals = vals || new Values(),
        ctx = this;

    function recordToInsert(record, vals) {
        var keys = Object.keys(record),
            values = keys.map(col => vals.push(record[col]));

        return `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES(${values.join(', ')})`;
    }

    function recordToDelete(record, vals) {
        return `DELETE FROM ${tableName} ${util.recordToWhere(record, vals)}`;
    }

    records.forEach(function(record) {

        record = util.identifyRecord(record, ctx.lookup);

        if (record.teacher_id === undefined) {
            record.teacher_id = ctx.userId;
        }

        let validationErrors = validator(record);

        delete record.assignment_date;

        if (validationErrors) {
            if (validationErrors.length === 1 && record.assignment === null) {
                // Assignment is null which is an implied delete, we can ignore this validation error, provided that it
                // is the only validation error
                delete record.assignment;
                delete record.teacher_id;

                sqlStatements.push(recordToDelete(record, vals));
            } else {
                let error = { errors: validationErrors };
                error[`${pluralize.singular(entity)}_record`] = record;
                errors.push(error);
            }
        } else {
            sqlStatements.push(recordToInsert(record, vals));
        }
    });

    return {
        sql: sqlStatements,
        vals: vals,
        errors: errors
    };
}

function *postHandler(entity) {
    var body = this.request.body,
        error,
        tableName,
        vals,
        result,
        query;

    if (!this.isTeacher) {
        this.throw(
            new Error(`Only teachers can assign ${entity}; you are logged in as a: ${this.session.accountLevel}`),
            403
        );
    }

    if (typeof body !== 'object' || Array.isArray(body)) {
        return this.throw(
            new Error(`POST request body must be a single ${pluralize.singular(entity)} assignment object.`),
            400
        );
    }

    body = [body];

    query = sqlGenerator.call(this, entity, body);

    if (query.errors.length > 0) {
        this.status = 400;
        return this.body = {
            success: false,
            error: query.errors
        };
    }

    yield this.pgp.none(query.sql.join(';\n') + ';', query.vals.vals)
        .catch(function(e) {
            error = { message: e.toString() };
            Object.assign(error, e);
        });

    if (error) {
        this.status = 500;
        return this.body = {
            error: [error],
            success: false
        };
    }

    tableName = `${pluralize.singular(entity)}_assignments`;
    vals = new Values();
    result = yield this.pgp.oneOrNone(recordToSelect(body[0], tableName, vals), vals.vals);

    if (result) {
        this.status = 201;
        return this.body = result;
    } else {
        this.status = 202;
        return this.body = {
            success: true,
            warning: 'No-op: record was dropped because it duplicates an identical assignment at a higher scope'
        };
    }
}

function *patchHandler(entity) {
    var body = this.request.body,
        query,
        error;

    if (!this.isTeacher) {
        this.throw(
            new Error(`Only teachers can assign ${entity}; you are logged in as a: ${this.session.accountLevel}`),
            403
        );
    }

    if (!Array.isArray(body)) {
        return this.throw(new Error(`PATCH request body must be an array of ${entity} assignments.`), 400);
    }

    query = sqlGenerator.call(this, entity, body);

    if (query.errors.length > 0) {
        this.status = 400;
        return this.body = {
            success: false,
            error: query.errors
        };
    }

    query.sql.unshift('BEGIN');
    query.sql.push('COMMIT');

    yield this.pgp.none(query.sql.join(';\n') + ';', query.vals.vals)
        .catch(function(e) {
            error = { message: e.toString() };
            Object.assign(error, e);
        });

    if (error) {
        this.status = 500;
        return this.body = {
            error: [error],
            success: false
        };
    }

    this.body = {
        success: true
    };
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    post: postHandler,
    sqlGenerator: sqlGenerator,
    recordToSelect: recordToSelect,
    autoRoute: false
};
