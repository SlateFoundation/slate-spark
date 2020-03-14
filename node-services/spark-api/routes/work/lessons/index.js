'use strict';

const selectFromRequest = require('../../../lib/util.js').selectFromRequest;
const validateRecordSet = require('../../../lib/util.js').validateRecordSet;
const queriesToReturningJsonCte = require('../../../lib/util.js').queriesToReturningJsonCte;
const Values = require('../../../lib/util.js').Values;
const util = require('../../../lib/util.js');

// TODO: Implement temporal/revisions
// TODO: Implement security using RLS

function recordToModel(record) {
    var lesson = record.template || {};

    for (var key in record) {
        if (key === 'template') continue;
        lesson[key] = record[key];
    }

    return lesson;
}

// Get all of the lessons, by content area id, filtering by author_id for unpublished content, unless admin/developer
function *getHandler() {
    var ctx = this,
        lessons = yield selectFromRequest.call(ctx, 'lessons');

    ctx.body = lessons.map(record => util.codifyRecord(recordToModel(record), ctx.lookup));
}


function *patchHandler() {
    var ctx = this;
    var reqBody = ctx.request.body
    var lessons = Array.isArray(reqBody) ? reqBody : typeof reqBody === 'object' ? [reqBody] : null;
    var vals = new Values();
    var recordToUpsert = util.recordToUpsert.bind(ctx);
    var queries = [];
    var tableColumns = Object.keys(ctx.introspection.tables.lessons);

    ctx.assert(
        Array.isArray(lessons) && lessons.length > 0,
        400,
        'request body must be a lesson or an array of one or lessons in JSON format'
    );

    lessons.forEach(function(lesson) {
        ctx.assert(typeof lesson === 'object', 400, 'lesson must be a json object');
        lesson.author_id || (lesson.author_id = ctx.userId);
        lesson.template || (lesson.template = {});

        // Allow null "id" on creation
        if (lesson.id === null) {
            delete lesson.id;
        }

        if (lesson.published === true) {
            lesson.published = new Date().toUTCString();
        }

        if (lesson.id) {
            lesson.modified = new Date().toUTCString();
        }

        let canWrite = (!lesson.id || lesson.author_id === ctx.userId || ctx.isAdmin || ctx.isDeveloper);
        ctx.assert(canWrite, 403, 'Only the author of a lesson or an administrator/developer can PATCH lessons.');
        Object
            .keys(lesson)
            .filter(col => !tableColumns.includes(col) && col !== 'template')
            .forEach(function(col) {
                var val = lesson[col];
                if (val === undefined) return;
                lesson.template[col] = val;
                delete lesson[col];
            });
        tableColumns.forEach(function(col) {
            if (col === 'template') return;
            lesson.template[col] = lesson[col];
        });
        queries.push(recordToUpsert('lessons', lesson, vals));
    });

    lessons = validateRecordSet(ctx, 'lessons', lessons);

    if (lessons.sucess === false) return;

    queries = queriesToReturningJsonCte(queries);
    lessons = yield ctx.pgp.any(queries, vals.vals);

    ctx.body = lessons.map(record => {
        var lesson;

        record = record.json;

        lesson = record.template;
        delete record.template;

        for(var key in record) {
            lesson[key] = record[key];
        }

        delete lesson.template;

        return lesson;
    });
}

function *deleteHandler() {
    var ctx = this;
    var lessonId = ~~ctx.query.id;
    var lesson, canDelete;

    ctx.assert(lessonId, 400, 'id must be set to the numeric id of the lesson');

    try {
        lesson = yield ctx.pgp.one(
            'SELECT * FROM lessons WHERE id = $1 LIMIT 1',
            [lessonId]
        );
    } catch (e) {
        ctx.status = 204;
        return;
    }

    // Unpublished lessons can be deleted by an admin/developer, or their author
    ctx.assert(!lesson.published, 400, 'You cannot delete a lesson that has been published.');
    canDelete = (lesson.author_id === ctx.userId || ctx.isAdmin || ctx.isDeveloper);
    ctx.assert(canDelete, 403, 'Only the author of a lesson or an administrator/developer can delete a lesson.');

    try {
        yield ctx.pgp.one(
            'DELETE FROM lessons WHERE id = $1',
            [lessonId]
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
