var util = require('../../lib/util');

function *getHandler() {
    this.require(['section_id']);

    var sectionId = this.query.section_id,
        ctx = this;

    ctx.body = yield ctx.pgp.manyOrNone(/*language=SQL*/ `
        SELECT t.last_accessed,
               t.section_id,
               t.section_code,
               t.student_id,
               t.sparkpoint_id,
               t.recommender_id,
               t.recommended_time,
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
               selected_apply_resource_id,
               learn_mastery_check_score,
               conference_mastery_check_score,
               code AS sparkpoint
          FROM (
            SELECT student_id,
                   sparkpoint_id,
                   section_id,
                   last_accessed,
                   recommender_id,
                   recommended_time,
                   cs."Code" AS section_code,
                   ROW_NUMBER() OVER (
                     PARTITION BY ssas.student_id, ssas.section_id
                         ORDER BY ssas.last_accessed DESC) AS rn
              FROM section_student_active_sparkpoint ssas
         LEFT JOIN course_sections cs ON cs."ID" = section_id
             WHERE section_id = $1 AND last_accessed IS NOT NULL
          ) t
     LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = t.sparkpoint_id
           AND ss.student_id = t.student_id
          JOIN sparkpoints ON sparkpoints.id = t.sparkpoint_id
         WHERE t.rn = 1;`,
        [sectionId]
    );
}

function *patchHandler(req, res, next) {
    var ctx = this,
        sectionId = ctx.query.section_id,
        studentId = ctx.studentId,
        sparkpointId = ctx.query.sparkpoint_id,
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
            'conference_group_id',
            'learn_mastery_check_score',
            'conference_mastery_check_score'
        ],
        timeKeys = [],
        updateValues = [],
        timeValues = [],
        body = ctx.request.body,
        allKeys = Object.keys(body || {}),
        hasMasteryCheckScores = false,
        invalidKeys, activeSql, sparkpointSql, record, values;

    ctx.require(['section_id', 'sparkpoint_id']);

    ctx.assert(studentId, `student_id is required for non-students. You are logged in as a: ${ctx.role}`, 400);

    // This filter also sets timeKeys and timeValues
    invalidKeys = allKeys.filter(function (key) {
        var val;

        if (key === 'student_id') {
            return;
        }
        
        if (key === 'conference_group_id') {
            // Allow null values and values that cast to a number, silently ignore invalid values

            if (body.conference_group_id !== null) {
                val = parseInt(body.conference_group_id, 10);

                if (isNaN(val)) {
                    ctx.throw(
                        `conference_group_id must be a number or null, you provided: ${body.conference_group_id}`,
                        400
                    );
                }
            } else {
                val = 'NULL';
            }

            timeKeys.push('conference_group_id');
            timeValues.push(val);
            updateValues.push(`conference_group_id = ${val}`);
        } else if (key.indexOf('time') !== -1) {
            val = parseInt(body[key], 10);

            if (!isNaN(val)) {
                val = "'" + new Date(val * 1000).toUTCString() + "'";
                timeKeys.push(key);
                timeValues.push(val);
                updateValues.push(`${key} = ${val}`);
            } else {
                // TODO: breakout date/time parsing
                ctx.throw(
                    `${key} must should be the number of seconds since epoch in UTC, you provided: ${body[key]}`,
                    400
                );
            }
        } else if (key.indexOf('mastery_check_score') !== -1) {
            hasMasteryCheckScores = true;

            // TODO: implement in RLS
            if (!ctx.isTeacher) {
                ctx.throw(new Error('Only teachers can set mastery check scores.'), 403);
            }

            if (body[key] !== null) {
                val = parseInt(body[key], 10);

                // TODO: this should be a database check constraint
                if (isNaN(val) || val < 1 || val > 100) {
                    ctx.throw(
                        `${key} must be a number between 1 and 100 or null, you provided: ${body[key]}`,
                        400
                    );
                }
            } else {
                val = 'NULL';
            }

            timeKeys.push(key);
            timeValues.push(val);
            updateValues.push(`${key} = ${val}`);
        }

        return allowedKeys.indexOf(key) === -1;
    });

    if (invalidKeys.length > 0) {
        ctx.throw(new Error('Unexpected field(s) encountered: ' + invalidKeys.join(', ')), 400);
    }

    activeSql = `
        INSERT INTO section_student_active_sparkpoint
                    (section_id, student_id, sparkpoint_id, ${ctx.isStudent ? 'last_accessed' : 'recommended_time, recommender_id'})
             VALUES ($1, $2, $3, now()::timestamp without time zone ${ctx.isStudent ? '' : ', $4'})
        ON CONFLICT (section_id, student_id, sparkpoint_id) DO `;

    values = [sectionId, studentId, sparkpointId];

    if (ctx.isTeacher) {
        activeSql += 'UPDATE SET recommender_id = $4, recommended_time = now()::timestamp without time zone;';
        values.push(ctx.userId);
    } else {
        activeSql += 'UPDATE SET last_accessed = now()::timestamp without time zone;';
    }

    if (!hasMasteryCheckScores) {
        // Do not set the recommended time when a teacher posts a mastery check score
        yield ctx.pgp.oneOrNone(activeSql, values);
    }

    if (timeKeys.length === 0) {
        // Return existing row, no time updates
        sparkpointSql = `
            SELECT *
              FROM student_sparkpoint
             WHERE student_id = $1
               AND sparkpoint_id = $2;
        `;

        record = yield ctx.pgp.oneOrNone(sparkpointSql, [studentId, sparkpointId]);

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

        record = yield ctx.pgp.one(sparkpointSql, [studentId, sparkpointId]);
    }

    delete record.id;
    record.section_id = ctx.query.section_id;
    record = util.codifyRecord(record, ctx.lookup);
    // TODO: Deprecate sparkpoint (use sparkpoint_code instead)
    record.sparkpoint = record.sparkpoint_code;

    ctx.body = record;
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
};
