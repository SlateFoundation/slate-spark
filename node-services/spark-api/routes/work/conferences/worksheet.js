'use strict';

function* patchHandler(req, res, next) {
    this.require(['sparkpoint_id', 'student_id']);

    var sparkpointId = this.query.sparkpoint_id,
        studentId = this.studentId,
        body = this.request.body,
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

    if (invalidKeys.length > 0) {
        return this.throw(`The following invalid key(s) were passed: ${invalidKeys.join(',')}. Valid keys are: ${allowedKeys.join(', ')}`, 400);
    }

    allowedKeys.forEach(function(key) {
        if (key === 'sparkpoint') {
            return;
        } else {
            worksheet[key] = body[key] || null;
        }
    });

    record = yield this.pgp.one(`
        INSERT INTO conference_worksheets
                    (student_id, sparkpoint_id, worksheet)
             VALUES ($1, $2, $3) ON CONFLICT (student_id, sparkpoint_id) DO UPDATE SET worksheet = $3
          RETURNING *;
          `,
        [
            studentId,
            sparkpointId,
            worksheet
        ]);


    record = record.worksheet;
    record.student_id = studentId;
    record.sparkpoint = yield this.lookup.sparkpoint.idToCode(sparkpointId);

    this.body = record;
}

module.exports = {
    patch: patchHandler
};
