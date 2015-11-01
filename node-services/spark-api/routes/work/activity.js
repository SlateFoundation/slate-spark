var util = require('../../lib/util'),
    lookup = require('../../lib/lookup');

function *getHandler() {
    var activities = [];

    this.require(['section_id']);

    var sectionId = this.query.section_id,
        query = `
       SELECT sparkpoints.code AS sparkpoint,
              ssas.student_id,
              ssas.sparkpoint_id,
              ssas.section_id AS section,
              ss.learn_start_time,
              ss.learn_finish_time,
              ss.conference_start_time,
              ss.conference_join_time,
              ss.conference_finish_time,
              ss.apply_start_time,
              ss.apply_ready_time,
              ss.apply_finish_time,
              ss.assess_start_time,
              ss.assess_ready_time,
              ss.assess_finish_time
         FROM section_student_active_sparkpoint ssas
    LEFT JOIN student_sparkpoint ss ON ss.student_id = ssas.student_id
          AND ss.sparkpoint_id = ssas.sparkpoint_id
         JOIN sparkpoints ON ssas.sparkpoint_id = sparkpoints.id
        WHERE ssas.section_id = $1;
  `;

    this.body = yield this.pgp.manyOrNone(query, [sectionId]);
}

function *patchHandler(req, res, next) {
    this.require(['student_id', 'section_id', 'sparkpoint_id']);

    var sectionId = this.query.section_id,
        studentId = this.studentId,
        sparkpointId = this.query.sparkpoint_id,
        allowedKeys = [
            'sparkpoint',
            'learn_start_time',
            'learn_finish_time',
            'conference_start_time',
            'conference_join_time',
            'conference_finish_time',
            'apply_start_time',
            'apply_ready_time',
            'apply_finish_time',
            'assess_start_time',
            'assess_ready_time',
            'assess_finish_time'
        ],
        timeKeys = [],
        updateValues = [],
        timeValues = [],
        body = this.request.body,
        allKeys = Object.keys(body || {}),
        invalidKeys, activeSql, sparkpointSql, record;

    // This filter also sets timeKeys and timeValues
    invalidKeys = allKeys.filter(function (key) {
        var val;

        if (key.indexOf('time') !== -1) {
            val = parseInt(body[key], 10);

            if (!isNaN(val)) {
                val = "'" + new Date(val * 1000).toUTCString() + "'";
                timeKeys.push(key);
                timeValues.push(val);
                updateValues.push(`${key} = ${val}`);
            }
        }

        return allowedKeys.indexOf(key) === -1;
    });

    if (invalidKeys.length > 1) {
        this.throw({
            error: 'Unexpected field(s) encountered: ' + invalidKeys.join(', '),
            body: req.body,
            params: req.params
        }, 400);
    }

    activeSql = `
        INSERT INTO section_student_active_sparkpoint
                    (section_id, student_id, sparkpoint_id)
             VALUES ($1, $2, $3)
        ON CONFLICT (section_id, student_id) DO UPDATE
                SET sparkpoint_id = $3;`;

    yield this.pgp.oneOrNone(activeSql, [sectionId, studentId, sparkpointId]);

    if (timeKeys.length === 0) {
        // Return existing row, no time updates
        sparkpointSql = `
            SELECT *
              FROM student_sparkpoint
             WHERE student_id = $1
               AND sparkpoint_id = $2;
        `;

        record = yield this.pgp.oneOrNone(sparkpointSql, [studentId, sparkpointId]);

        if (record) {
            // TODO: @themightychris: It seems like this response would not contain the sparkpoint,
            // only the sparkpoint id... does this matter to you and have you encountered it?
            delete record.id;
        } else {
            record = {
                student_id: studentId,
                sparkpoint_id: sparkpointId
            };

            allowedKeys.forEach(function (key) {
                if (key === 'sparkpoint') {
                    record.sparkpoint = util.toSparkpointId(sparkpointId);
                } else {
                    record[key] = null;
                }
            });
        }

        this.body = record;
    } else {
        // Upsert time updates, return updated row
        sparkpointSql = `
            INSERT INTO student_sparkpoint (student_id, sparkpoint_id,  ${timeKeys.join(', ')})
                                    VALUES ($1, $2, ${timeValues.join(', ')}) ON CONFLICT (student_id, sparkpoint_id)
                             DO UPDATE SET ${updateValues.join(',\n')}
                                 RETURNING *;`;

        record = yield this.pgp.one(sparkpointSql, [studentId, sparkpointId]);
        delete record.id;
        this.body = record;
    }
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
};
