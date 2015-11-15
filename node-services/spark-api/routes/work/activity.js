var util = require('../../lib/util'),
    lookup = require('../../lib/lookup');

function *getHandler() {
    this.require(['section_id']);

    var sectionId = this.query.section_id,
        query = `
            SELECT t.last_accessed,
                   t.section_id,
                   t.student_id,
                   t.sparkpoint_id,
                   t.recommender_id,
                   learn_start_time,
                   learn_finish_time,
                   conference_start_time,
                   conference_finish_time,
                   conference_join_time,
                   apply_start_time,
                   apply_ready_time,
                   apply_finish_time,
                   assess_start_time,
                   assess_ready_time,
                   assess_finish_time,
                   conference_group_id,
                   selected_apply_id,
                   selected_fb_apply_id,
                   code AS sparkpoint
              FROM (
                SELECT student_id,
                       sparkpoint_id,
                       section_id,
                       last_accessed,
                       ROW_NUMBER() OVER (
                         PARTITION BY ssas.student_id, ssas.section_id
                             ORDER BY ssas.last_accessed desc) AS rn
                  FROM section_student_active_sparkpoint ssas
                 WHERE section_id = $1 AND last_accessed IS NOT NULL
              ) t
            LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = t.sparkpoint_id
                  AND ss.student_id = t.student_id
                 JOIN sparkpoints ON sparkpoints.id = t.sparkpoint_id
                WHERE t.rn = 1;`;

    records = yield this.pgp.manyOrNone(query, [sectionId]);

    records.forEach(function(record) {
        delete record.section_id;
        delete record.rn;
    });

    this.body = records;
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
            'assess_finish_time',
            'conference_group_id'
        ],
        timeKeys = [],
        updateValues = [],
        timeValues = [],
        body = this.request.body,
        allKeys = Object.keys(body || {}),
        invalidKeys, activeSql, sparkpointSql, record, values;

    // This filter also sets timeKeys and timeValues
    invalidKeys = allKeys.filter(function (key) {
        var val;

        if (key === 'student_id') {
            return;
        }

        if (key === 'conference_group_id') {
            val = parseInt(body.conference_group_id, 10);
            if (!isNaN(val)) {
                timeKeys.push('conference_group_id');
                timeValues.push(val);
                updateValues.push(`conference_group_id = ${val}`)
            }
        }

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

    if (invalidKeys.length > 0) {
        this.throw(new Error('Unexpected field(s) encountered: ' + invalidKeys.join(', ')), 400);
    }

    activeSql = `
        INSERT INTO section_student_active_sparkpoint
                    (section_id, student_id, sparkpoint_id, ${this.isStudent ? 'last_accessed' : 'recommender_id'})
             VALUES ($1, $2, $3, ${this.isStudent ? 'now()::timestamp without time zone' : '$4'})
        ON CONFLICT (section_id, student_id, sparkpoint_id) DO `;

    values = [sectionId, studentId, sparkpointId];

    if (this.isTeacher) {
        activeSql += 'UPDATE SET recommender_id = $4;';
        values.push(this.userId);
    } else {
        activeSql += 'UPDATE SET last_accessed = now()::timestamp without time zone;';
    }

    yield this.pgp.oneOrNone(activeSql, values);

    if (timeKeys.length === 0) {
        // Return existing row, no time updates
        sparkpointSql = `
            SELECT *
              FROM student_sparkpoint
             WHERE student_id = $1
               AND sparkpoint_id = $2;
        `;

        record = yield this.pgp.oneOrNone(sparkpointSql, [studentId, sparkpointId]);

        if (!record) {
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
    } else {
        // Upsert time updates, return updated row
        sparkpointSql = `
            INSERT INTO student_sparkpoint (student_id, sparkpoint_id,  ${timeKeys.join(', ')})
                                    VALUES ($1, $2, ${timeValues.join(', ')}) ON CONFLICT (student_id, sparkpoint_id)
                             DO UPDATE SET ${updateValues.join(',\n')}
                                 RETURNING *;`;

        record = yield this.pgp.one(sparkpointSql, [studentId, sparkpointId]);
    }

    delete record.id;
    record.sparkpoint = util.toSparkpointCode(record.sparkpoint_id);
    this.body = record;
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
};
