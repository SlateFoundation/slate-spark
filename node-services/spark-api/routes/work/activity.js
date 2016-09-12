var util = require('../../lib/util');

function *getHandler() {
    this.require(['section_id']);

    var ctx = this,
        sectionId = ctx.query.section_id,
        status = ctx.query.status || 'active';

    ctx.assert(ctx.isTeacher, 'Only teachers can access the activity endpoint.', 403);
    ctx.assert(status === 'all' || status === 'active', 'status is implied active, valid values are all/active', 400);

    if (status === 'active') {
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
               rn::INTEGER AS student_sequence
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
}

function *patchHandler() {
    var ctx = this,
        sectionId = ctx.query.section_id,
        studentId = ctx.studentId,
        sparkpointId = ctx.query.sparkpoint_id,
        updateSectionStudentActiveSparkpoint = true,
        recordToUpsert = util.recordToUpsert.bind(ctx),
        activity = ctx.request.body,
        vals = new util.Values(),
        record = {},
        errors;

    ctx.assert(!Array.isArray(activity), 'PATCH accepts a single object; not an array (batchActions: false)');
    ctx.require(['section_id', record.section_id = sectionId;'sparkpoint_id']);
    ctx.assert(studentId, `student_id is required for non-students. You are logged in as a: ${ctx.role}`, 400);

    // Parse _time values and set them on the student_sparkpoint record
    for (let key in activity) {
        let val = activity[key];

        if (key.includes('_time')) {
            // Allow *_override_time to be blanked by passing a null value
            if (val === null && key.includes('override_time')) {
                record[key] = null;
            } else {
                val = parseInt(activity[key], 10);
                ctx.assert(!isNaN(val), `${key} should be a UTC timestamp you provided: ${activity[key]}`, 400);
                record[key] = (val === null) ? null : new Date(val * 1000).toUTCString();
            }
        } else if (key.includes('_mastery_check_score')) {
            let val = parseInt(activity[key], 10);
            let isInvalid = isNaN(val) || val < 1 || val > 100;

            ctx.assert(ctx.isTeacher, 'Only teachers can set mastery check scores.', 403);
            ctx.assert(!isInvalid, `${key} must be between 1 and 100 or null, not: ${val}`, 400);

            record[key] = val;
            // When only a mastery_score value is set, we do not update the last_accessed time
            updateSectionStudentActiveSparkpoint = false;
        } else if (key in ctx.introspection.tables.student_sparkpoint) {
            record[key] = val;
        }
    }

    // We will set this explicitly later
    delete record.student_id;
    delete record.sparkpoint_id;
    delete record.id;

    // When an entire sparkpoint is overridden, we do not update the last accessed time
    if (activity.learn_override_time &&
        activity.conference_override_time &&
        activity.apply_override_time &&
        activity.assess_override_time) {
        updateSectionStudentActiveSparkpoint = false;
    }

    if (updateSectionStudentActiveSparkpoint) {
        let ssasRecord = {
            section_id: sectionId,
            sparkpoint_id: sparkpointId,
            student_id: studentId
        };

        if (ctx.isStudent) {
             ssasRecord.last_accessed = new Date().toUTCString();
        } else {
             ssasRecord.recommended_time = record.recommended_time || new Date().toUTCString();
             ssasRecord.recommender_id = ctx.userId;
        }

        yield ctx.pgp.any(recordToUpsert('section_student_active_sparkpoint',  ssasRecord, vals, ['section_id', 'sparkpoint_id', 'student_id']), vals.vals);
    }

    delete record.recommended_time;

    // Validate record and generate SQL for student_sparkpoint table
    record.sparkpoint_id = sparkpointId;
    record.student_id = studentId;
    //TODO: section_id is a string in production
    if (ctx.schema === 'sandbox-school' || ctx.schema.indexOf('-staging') !== -1) {
        record.section_id = sectionId;
    } else {
        record.section_id = '' + sectionId;
    }

    errors = ctx.validation.student_sparkpoint(record);

    ctx.assert(errors !== null, errors, 400);
    let result = yield ctx.pgp.oneOrNone(recordToUpsert('student_sparkpoint', record, vals, ['sparkpoint_id', 'student_id']) + ' RETURNING *;', vals.vals);
    ctx.body = result || (yield ctx.pgp.one('SELECT * FROM student_sparkpoint WHERE sparkpoint_id = $1 AND student_id = $2', [sparkpointId, studentId]));
}

module.exports = {
    get: getHandler,
    patch: patchHandler
};
