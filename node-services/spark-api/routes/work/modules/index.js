'use strict';

const selectFromRequest = require('../../../lib/util.js').selectFromRequest;
const validateRecordSet = require('../../../lib/util.js').validateRecordSet;
const queriesToReturningJsonCte = require('../../../lib/util.js').queriesToReturningJsonCte;
const Values = require('../../../lib/util.js').Values;
const util = require('../../../lib/util.js');

// TODO: Implement temporal/revisions
// TODO: Implement security using RLS

function recordToModel(record) {
    var module = record.template || {};

    for (var key in record) {
        if (key === 'template') continue;
        module[key] = record[key];
    }

    return module;
}

// Get all of the modules, by content area id, filtering by author_id for unpublished content, unless admin/developer
function *getHandler() {
    var ctx = this,
        modules = yield selectFromRequest.call(ctx, 'modules');

    ctx.body = modules.map(record => util.codifyRecord(recordToModel(record), ctx.lookup));
}


function *patchHandler() {
    var ctx = this;
    var reqBody = ctx.request.body
    var modules = Array.isArray(reqBody) ? reqBody : typeof reqBody === 'object' ? [reqBody] : null;
    var vals = new Values();
    var recordToUpsert = util.recordToUpsert.bind(ctx);
    var queries = [];
    var tableColumns = Object.keys(ctx.introspection.tables.modules);

    ctx.assert(
        Array.isArray(modules) && modules.length > 0,
        400,
        'request body must be a module or an array of one or modules in JSON format'
    );

    modules.forEach(function(module) {
        ctx.assert(typeof module === 'object', 400, 'module must be a json object');
        module.author_id || (module.author_id = ctx.userId);
        module.template || (module.template = {});

        // Allow null "id" on creation
        if (module.id === null) {
            delete module.id;
        }

        if (module.published === true) {
            module.published = new Date().toUTCString();
        }

        if (module.id) {
            module.modified = new Date().toUTCString();
        }

        let canWrite = (!module.id || module.author_id === ctx.userId || ctx.isAdmin || ctx.isDeveloper);
        ctx.assert(canWrite, 403, 'Only the author of a module or an administrator/developer can PATCH modules.');
        Object
            .keys(module)
            .filter(col => !tableColumns.includes(col) && col !== 'template')
            .forEach(function(col) {
                var val = module[col];
                if (val === undefined) return;
                module.template[col] = val;
                delete module[col];
            });
        tableColumns.forEach(function(col) {
            if (col === 'template') return;
            module.template[col] = module[col];
        });
        queries.push(recordToUpsert('modules', module, vals));
    });

    modules = validateRecordSet(ctx, 'modules', modules);

    if (modules.sucess === false) return;

    queries = queriesToReturningJsonCte(queries);
    modules = yield ctx.pgp.any(queries, vals.vals);

    ctx.body = modules.map(record => {
        var module;

        record = record.json;

        module = record.template;
        delete record.template;

        for(var key in record) {
            module[key] = record[key];
        }

        delete module.template;

        return module;
    });
}

function *deleteHandler() {
    var ctx = this;
    var moduleId = ~~ctx.query.id;
    var module, canDelete;

    ctx.assert(moduleId, 400, 'id must be set to the numeric id of the module');

    try {
        module = yield ctx.pgp.one(
            'SELECT * FROM modules WHERE id = $1 LIMIT 1',
            [moduleId]
        );
    } catch (e) {
        ctx.status = 204;
        return;
    }

    // Unpublished modules can be deleted by an admin/developer, or their author
    ctx.assert(!module.published, 400, 'You cannot delete a module that has been published.');
    canDelete = (module.author_id === ctx.userId || ctx.isAdmin || ctx.isDeveloper);
    ctx.assert(canDelete, 403, 'Only the author of a module or an administrator/developer can delete a module.');

    try {
        yield ctx.pgp.one(
            'DELETE FROM modules WHERE id = $1',
            [moduleId]
        );
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.status = 204;
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    delete: deleteHandler,
    recordToModel: recordToModel
};
