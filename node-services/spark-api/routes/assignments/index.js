'use strict';

var util = require('../../lib/util'),
    Values = util.Values,
    entities = ['learns', 'applies', 'assessments', 'conference_resources', 'guiding_questions'],
    pluralize = require('pluralize'),
    sqlGenerator = require('./entity.js').sqlGenerator,
    fs = require('co-fs');

function *getHandler() {
    var vals = new Values(),
        jsonObject = [],
        results,
        codifyRecord = util.codifyRecord.bind(this),
        // HACK: Since all assignment tables have the same structure, we use learn_assignments here:
        where = util.whereFromRequest.call(this, 'learn_assignments', vals);

        entities.forEach(function(entity) {
            let tableName = `${pluralize.singular(entity)}_assignments`;
            jsonObject.push(`'${entity}'`),
            jsonObject.push(`COALESCE((SELECT json_agg(row_to_json(${tableName})) FROM ${tableName}${where}), '[]'::JSON)`);
        });

    results = (yield this.pgp.one(`
        SELECT json_build_object(
        ${jsonObject.join(',\n')}
        ) AS json
    `, vals.vals)).json;

    for(var entity in results) {
        results[entity] = results[entity].map(codifyRecord);
    }

    this.body = results;
}

function *patchHandler() {
    var body = this.request.body,
        vals = new Values(),
        sql = ['BEGIN'],
        errors = [],
        error;

    if (typeof body !== 'object' || Array.isArray(body)) {
        this.throw(
            new Error(`Request body must be an object with one or more of the following keys: ${entities.join(', ')}`),
            400
        );
    }

    for (var entity in body) {
        let records = body[entity];

        if (entities.indexOf(entity) === -1) {
            errors.push(`Unexpected key in request body: ${key}; allowed keys are: ${entities.join(', ')}`);
        } else if (!Array.isArray(records)) {
            errors.push(`${key} must be an array of ${pluralize.singular(entity)} assignment objects`);
        } else {
            let result = sqlGenerator.call(this, entity, records, vals);
            sql = sql.concat(result.sql);
            errors = errors.concat(result.errors);
        }
    }

    // Failure during validation stage (400)
    if (errors.length > 0) {
        this.status = 400;

        return this.body = {
            success: false,
            errors: errors
        };
    }

    sql.push('COMMIT');

    yield this.pgp.none(sql.join(';\n') + ';', vals.vals)
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

function* getReportHandler() {
    var ctx = this,
        sql = (yield fs.readFile(__dirname + '/usage_report.sql', 'utf-8'));

    ctx.assert(ctx.isTeacher, 'Only teachers, administrators, staff and developers can access reports', 403);

    ctx.body = (yield ctx.sharedPgp.one(sql)).json;
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    report: {
        get: getReportHandler
    }
};
