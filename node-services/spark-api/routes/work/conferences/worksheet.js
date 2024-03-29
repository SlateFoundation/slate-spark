'use strict';

function* patchHandler(req, res, next) {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        studentId = ctx.isStudent ? ctx.studentId : ~~ctx.query.student_id,
        sectionId = ctx.query.section_id,
        body = ctx.request.body,
        keys = Object.keys(body || {}),
        allowedKeys = [
            'sparkpoint',
            'restated',
            'steps',
            'example_1',
            'example_2',
            'example_3',
            'peer_id',
            'peer_feedback'
        ],
        invalidKeys = keys.filter(key => allowedKeys.indexOf(key) === -1),
        worksheet = {},
        record;

    ctx.require(['sparkpoint_id', 'section_id']);

    ctx.assert(studentId > 0, 'Non-student users must pass a student_id', 400);

    if (invalidKeys.length > 0) {
        return ctx.throw(`The following invalid key(s) were passed: ${invalidKeys.join(',')}. Valid keys are: ${allowedKeys.join(', ')}`, 400);
    }

    allowedKeys.forEach(function(key) {
        if (key === 'sparkpoint') {
            return;
        } else {
            worksheet[key] = body[key] || null;
        }
    });

    record = yield ctx.pgp.one(/*language=SQL*/ `
        INSERT INTO conference_worksheets
                    (student_id, sparkpoint_id, section_id, worksheet)
             VALUES ($1, $2, $3, $4) ON CONFLICT (student_id, sparkpoint_id, section_id) DO UPDATE SET worksheet = $4
          RETURNING *;
          `,
        [
            studentId,
            sparkpointId,
            sectionId,
            worksheet
        ]);


    record = record.worksheet;
    record.student_id = studentId;
    record.sparkpoint = yield ctx.lookup.sparkpoint.idToCode(sparkpointId);

    ctx.body = record;
}

module.exports = {
    patch: patchHandler
};
