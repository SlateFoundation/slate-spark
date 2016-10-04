'use strict';

const identifyRecordSync = require('../../lib/util').identifyRecordSync;
const util = require('../../lib/util');

function *postHandler() {
    var ctx = this,
        suggestions = ctx.request.body,
        records,
        copyColumns = ['recommended_time', 'student_id', 'sparkpoint_id', 'section_id'],
        vals = new util.Values(),
        recordToUpsert = util.recordToUpsert.bind(ctx);

    ctx.assert(ctx.isTeacher, 'Only teachers can use the suggestions endpoint', 403);
    ctx.assert(Array.isArray(suggestions), 'The suggestions endpoint takes an array of suggestion objects', 400);

    records = suggestions.map(function (suggestion) {
        var record = {};

        suggestion = identifyRecordSync(suggestion, ctx.lookup);

        if (!suggestion.sparkpoint_id && suggestion.section_id && suggestion.student_id) {
            ctx.throw('sparkpoint_id, section_id and student_id are required', 400);
        }

        for (var key in suggestion) {
            if (copyColumns.includes(key)) {
                record[key] = suggestion[key];
            } else {
                ctx.throw(`Unexpected key: ${key}`, 400);
            }
        }

        // TODO: We could do additional validation on the timestamps here
        record.recommended_time = record.recommended_time || new Date().toUTCString();
        record.recommender_id = ctx.userId;

        return record;
    });

    records = yield ctx.pgp.any(util.queriesToReturningCte(
        records.map(record => recordToUpsert(
            'section_student_active_sparkpoint', record, vals, ['section_id', 'sparkpoint_id', 'student_id']), vals
        )
    ), vals.vals);

    ctx.body = records.map(record => util.codifyRecord(record, ctx.lookup));
}

module.exports = {
    post: postHandler
};
