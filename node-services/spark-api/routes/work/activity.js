'use strict';

var util = require('../../lib/util'),
    codifyRecord = util.codifyRecord,
    lessonEndpoint = require('./lessons/index.js');

function *getHandler() {
    this.require(['section_id']);

    var ctx = this,
        sectionId = ctx.query.section_id,
        status = ctx.query.status || 'active',
        activity;

    ctx.assert(ctx.isTeacher, 'Only teachers can access the activity endpoint.', 403);
    ctx.assert(status === 'all' || status === 'active', 'status is implied active, valid values are all/active', 400);

    ctx.set('Cache-control', 'private, must-revalidate;');

    if (status === 'active') {
        activity = yield ctx.pgp.manyOrNone(/*language=SQL*/ `
        SELECT t.last_accessed,
               t.section_id,
               t.section_code,
               t.student_id,
               t.sparkpoint_id,
               t.recommender_id,
               t.recommended_time,
               
               learn_start_time,
               learn_finish_time,
               learn_override_teacher_id,
               learn_override_time,
               
               conference_start_time,
               conference_finish_time,
               conference_join_time,
               conference_override_teacher_id,
               conference_override_time,
               
               apply_start_time,
               apply_ready_time,
               apply_finish_time,
               apply_override_teacher_id,
               apply_override_time,
               
               assess_start_time,
               assess_ready_time,
               assess_finish_time,
               assess_override_teacher_id,
               assess_override_time,
               
               override_reason,
               
               conference_group_id,
               selected_apply_id,
               selected_apply_resource_id,
               learn_mastery_check_score,
               conference_mastery_check_score,
               
               learn_pace_target,
               conference_pace_target,
               apply_pace_target,
               assess_pace_target,
               
               assessed_section_id,
               
               code AS sparkpoint,
               
              (CASE WHEN substring(t.sparkpoint_id FROM 1 FOR 1) = 'L'
                     THEN (
                        SELECT row_to_json(lessons)
                          FROM lessons
                         WHERE lessons.sparkpoint_id = t.sparkpoint_id
                     )
                     ELSE null
                END) AS lesson_template
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
             WHERE section_id = $1
             AND last_accessed IS NOT NULL
          ) t
     LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = t.sparkpoint_id
           AND ss.student_id = t.student_id
          JOIN sparkpoints ON sparkpoints.id = t.sparkpoint_id
         WHERE t.rn = 1;`,
            [sectionId]
        );
    } else {
        activity = yield ctx.pgp.manyOrNone(/*language=SQL*/ `
        SELECT t.last_accessed,
               t.section_id,
               t.section_code,
               t.student_id,
               t.sparkpoint_id,
               t.recommender_id,
               t.recommended_time,
               learn_start_time,
               learn_finish_time,
               learn_override_teacher_id,
               learn_override_time,
               conference_start_time,
               conference_finish_time,
               conference_join_time,
               conference_override_teacher_id,
               conference_override_time,
               apply_start_time,
               apply_ready_time,
               apply_finish_time,
               apply_override_teacher_id,
               apply_override_time,
               assess_start_time,
               assess_ready_time,
               assess_finish_time,
               assess_override_teacher_id,
               assess_override_time,
               override_reason,
               conference_group_id,
               selected_apply_id,
               selected_apply_resource_id,
               learn_mastery_check_score,
               conference_mastery_check_score,
               code AS sparkpoint,
               learn_pace_target,
               conference_pace_target,
               apply_pace_target,
               assess_pace_target,
               assessed_section_id,
               rn::INTEGER AS student_sequence,
               (CASE WHEN substring(t.sparkpoint_id FROM  1 FOR 1) = 'L'
                     THEN (
                        SELECT row_to_json(lessons)
                          FROM lessons
                         WHERE lessons.sparkpoint_id = t.sparkpoint_id
                     )
                     ELSE null
                END) AS lesson_template
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
                         ORDER BY ssas.last_accessed ASC) AS rn
              FROM section_student_active_sparkpoint ssas
         LEFT JOIN course_sections cs ON cs."ID" = section_id
             WHERE section_id = $1
             AND last_accessed IS NOT NULL
          ) t
    RIGHT JOIN student_sparkpoint ss
            ON ss.sparkpoint_id = t.sparkpoint_id
           AND (
            (ss.learn_start_time      IS NOT NULL AND ss.learn_finish_time      IS NOT NULL) OR
            (ss.conference_start_time IS NOT NULL AND ss.conference_finish_time IS NOT NULL) OR
            (ss.apply_start_time      IS NOT NULL AND ss.apply_finish_time      IS NOT NULL) OR
            (ss.assess_start_time     IS NOT NULL AND ss.assess_finish_time     IS NOT NULL)
           )
           AND ss.student_id = t.student_id
          JOIN sparkpoints ON sparkpoints.id = t.sparkpoint_id
      ORDER BY code DESC`,
            [sectionId]
        );
    }

    ctx.body = activity.map(record => {
        if (record.lesson_template) {
            record.lesson_template = util.codifyRecord(lessonEndpoint.recordToModel(record.lesson_template), ctx.lookup);
        } else {
            delete record.lesson_template;
        }

        return record;
    });
}

function *patchHandler() {
    // TODO: Audit how this works (particularly when the ssas table is updated for students/teachers)
    var ctx = this,
        sectionId = ~~ctx.query.section_id,
        studentId = ~~ctx.studentId,
        sparkpointId = ctx.query.sparkpoint_id,
        updateSectionStudentActiveSparkpoint = true,
        recordToUpsert = util.recordToUpsert.bind(ctx),
        isLesson = util.isLessonSparkpoint(sparkpointId),
        studentSparkpointRecords = [],
        activity = ctx.request.body,
        vals = new util.Values(),
        record = {},
        errors,
        now = new Date();

    ctx.assert(!Array.isArray(activity), 'PATCH accepts a single object; not an array (batchActions: false)', 400);
    ctx.require(['section_id', 'sparkpoint_id']);
    ctx.assert(studentId, `student_id is required for non-students. You are logged in as a: ${ctx.role}`, 400);

    // Parse _time values and set them on the student_sparkpoint record
    for (let key in activity) {
        let val = activity[key];

        if (key.includes('_time')) {
            if (val === true || val === 'now') {
                record[key] = now;
            } else {
                val = parseInt(val, 10);

                ctx.assert(!isNaN(val),
                    `${key} should be a UTC timestamp, "now", or true you provided: ${activity[key]}`, 400
                );

                record[key] = (val === null) ? null : new Date(val * 1000).toUTCString();
            }

            if (key.includes('override_time')) {
                // Allow *_override_time to be blanked by passing a null value
                if (val === null) {
                    record[key] = null;
                    record[key.replace('_time', '_teacher_id')] = null;
                } else {
                    record[key.replace('_time', '_teacher_id')] = ctx.userId;
                }
            }
        } else if (key.includes('_mastery_check_score')) {
            let val = parseInt(activity[key], 10);
            let isInvalid = (isNaN(val) && val !== null) || val < 1 || val > 100;

            ctx.assert(ctx.isTeacher, 'Only teachers can set mastery check scores.', 403);
            ctx.assert(!isInvalid, `${key} must be between 1 and 100 or null, not: ${val}`, 400);

            record[key] = val;
            // When only a mastery_score value is set, we do not update the last_accessed time
            updateSectionStudentActiveSparkpoint = false;
        } else if (key in ctx.introspection.tables.student_sparkpoint) {
            record[key] = val;
        }
    }

    // When finishing a lesson, we must create dummy student_sparkpoint records for the assessed sparkpoints
    if (isLesson && record.assess_finish_time) {
        let assessedSparkpointIds = activity.assessed_sparkpoint_ids;
        let lessonCode = ctx.lookup.sparkpoint.cache.idToCode[sparkpointId];

        ctx.assert(Array.isArray(assessedSparkpointIds) && assessedSparkpointIds.length > 0,
            'assessed_sparkpoint_ids required: When marking a lesson complete you must send an array of sparkpoint_ids.',
            400
        );

        studentSparkpointRecords = assessedSparkpointIds.map(assessedSparkpointId => {
            let record = {
                sparkpoint_id: assessedSparkpointId,
                student_id: studentId,
                learn_override_time: now,
                apply_override_time: now,
                conference_override_time: now,
                assess_override_time: now,
                learn_override_teacher_id: ctx.userId,
                conference_override_teacher_id: ctx.userId,
                apply_override_teacher_id: ctx.userId,
                assess_override_teacher_id: ctx.userId,
                override_reason: `Assessed as part of lesson: ${lessonCode} (${sparkpointId}) in Section #${sectionId}`,
                // TODO: We are not setting this as it could blow out existing work
                // assessed_section_id: sectionId,
                lesson_sparkpoint_id: sparkpointId
            };
            
            return record;
        });
    }

    // We will set this explicitly later
    delete record.student_id;
    delete record.sparkpoint_id;
    delete record.id;

    // When an entire sparkpoint is overridden, we do not update the last accessed time
    if (ctx.isStudent &&
        activity.learn_override_time &&
        activity.conference_override_time &&
        activity.apply_override_time &&
        activity.assess_override_time) {
        updateSectionStudentActiveSparkpoint = false;
    }

    // If we allow setting overrides for completed phases, the logic below must change to guard against an assess phase
    // override overwriting the assessed_section_id value containing the section_id the phase was actually completed in.
    if (record.assess_override_time !== undefined) {
        // If we have an override set, take care of setting OR unsetting the assessed_section_id
        record.assessed_section_id = (record.assess_override_time === null) ? null : sectionId;
    } else if (record.assess_finish_time) {
        // If we have a assess_finish_time set, set the assessed_section_id
        record.assessed_section_id = sectionId;
    }

    if (updateSectionStudentActiveSparkpoint || activity.forceActive) {
        let ssasRecord = {
            section_id: sectionId,
            sparkpoint_id: sparkpointId,
            student_id: studentId
        };

        if (ctx.isStudent) {
             ssasRecord.last_accessed = new Date().toUTCString();
        } else {
            ssasRecord.recommender_id = ctx.userId;

            if (record.recommended_time) {
                ssasRecord.recommended_time = record.recommended_time;
            }

            if (activity.forceActive) {
                ssasRecord.last_accessed = new Date().toUTCString();
            }
        }

        try {
            yield ctx.pgp.any(recordToUpsert(
                'section_student_active_sparkpoint',
                ssasRecord,
                vals,
                ['section_id', 'sparkpoint_id', 'student_id']
            ), vals.vals);
        } catch (error) {
            ctx.throw(400, error.message);
        }
    }

    delete record.recommended_time;

    // Validate record and generate SQL for student_sparkpoint table
    record.sparkpoint_id = sparkpointId;
    record.student_id = studentId;

    errors = ctx.validation.student_sparkpoint(record);

    ctx.assert(!errors, errors && errors.join('\n'), 400);

    studentSparkpointRecords.unshift(record);

    vals = new util.Values();

    let results = yield ctx.pgp.any(
        util.queriesToReturningCte(
            studentSparkpointRecords.map(record => {
                return recordToUpsert(
                    'student_sparkpoint',
                    record,
                    vals,
                    ['sparkpoint_id', 'student_id']
                )
            })
        ),
        vals.vals
    );

    let result = results.shift();

    let response = codifyRecord(result || (yield ctx.pgp.one(/*language=SQL*/ `
      SELECT *
        FROM student_sparkpoint
       WHERE sparkpoint_id = $1
         AND student_id = $2`,
            [sparkpointId, studentId]
    )), ctx.lookup);

    if (ctx.isStudent) {
        let lessonTemplate = yield ctx.pgp.oneOrNone('SELECT * FROM lessons WHERE sparkpoint_id = $1', sparkpointId);
        if (lessonTemplate) {
            response.lesson_template = util.codifyRecord(lessonEndpoint.recordToModel(lessonTemplate), ctx.lookup);
        }
    }

    ctx.body = response;
}

function *deleteHandler() {
    var ctx = this,
        sectionId = ~~ctx.query.section_id,
        studentId = ~~ctx.query.student_id,
        sparkpointId = ctx.query.sparkpoint_id;

    ctx.assert(sectionId > 0, 'section_id is required', 400);
    ctx.assert(studentId > 0, 'student_id is required', 400);
    ctx.assert(sparkpointId, 'sparkpoint_id is required', 400);
    ctx.assert(ctx.isTeacher, 'Only teachers can delete activity records', 403);

    yield ctx.pgp.none(/*language=SQL*/ `
      DELETE FROM section_student_active_sparkpoint
            WHERE section_id = $1
              AND student_id = $2
              AND sparkpoint_id = $3
    `, [sectionId, studentId, sparkpointId]
    );

    ctx.status = 204;
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    delete: deleteHandler
};
