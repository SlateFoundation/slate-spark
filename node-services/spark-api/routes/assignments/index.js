'use strict';

var util = require('../../lib/util'),
    Values = util.Values,
    entities = ['learns', 'applies', 'assessments', 'conference_resources', 'guiding_questions'],
    pluralize = require('pluralize'),
    sqlGenerator = require('./entity.js').sqlGenerator,
    fs = require('fs').promises;

async function getHandler(ctx, next) {
    var vals = new Values(),
        jsonObject = [],
        results,
        codifyRecord = util.codifyRecord.bind(ctx),
        // HACK: Since all assignment tables have the same structure, we use learn_assignments here:
        where = util.whereFromRequest.call(ctx, 'learn_assignments', vals);

        entities.forEach(function(entity) {
            let tableName = `${pluralize.singular(entity)}_assignments`;
            jsonObject.push(`'${entity}'`),
            jsonObject.push(`COALESCE((SELECT json_agg(row_to_json(${tableName})) FROM ${tableName}${where}), '[]'::JSON)`);
        });

    results = (await ctx.pgp.one(`
        SELECT json_build_object(
        ${jsonObject.join(',\n')}
        ) AS json
    `, vals.vals)).json;

    for(var entity in results) {
        results[entity] = results[entity].map(codifyRecord);
    }

    ctx.body = results;
}

async function patchHandler(ctx, next) {
    var body = ctx.request.body,
        vals = new Values(),
        sql = ['BEGIN'],
        errors = [],
        error;

    if (typeof body !== 'object' || Array.isArray(body)) {
        ctx.throw(
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
            let result = sqlGenerator.call(ctx, entity, records, vals);
            sql = sql.concat(result.sql);
            errors = errors.concat(result.errors);
        }
    }

    // Failure during validation stage (400)
    if (errors.length > 0) {
        ctx.status = 400;

        return ctx.body = {
            success: false,
            errors: errors
        };
    }

    sql.push('COMMIT');

    await ctx.pgp.none(sql.join(';\n') + ';', vals.vals)
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

async function getReportHandler(ctx, next) {
    var sql = (await fs.readFile(__dirname + '/usage_report.sql', 'utf-8'));

    ctx.assert(ctx.isTeacher, 'Only teachers, administrators, staff and developers can access reports', 403);

    ctx.body = (await ctx.pgp.one(sql)).json;
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    report: {
        get: getReportHandler
    }
};
