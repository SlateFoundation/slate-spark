'use strict';

function *getHandler() {
    var ctx = this,
        sectionId = ~~ctx.query.section_id,
        studentId = ~~ctx.query.student_id,
        studentWhere = (studentId > 0) ? 'AND ssas.student_id = $2' : '';

    ctx.assert(sectionId > 0, 'section_id is required', 400);

    ctx.body = yield ctx.pgp.any(/*language=SQL*/ `
       -- noinspection JSLint
       SELECT sp.code AS sparkpoint_code,
              sp.student_title,
                            
              cs."Code" AS section,
              
              ssas.last_accessed,
              ssas.section_id,
              ssas.student_id,
              ssas.sparkpoint_id,
              ssas.recommender_id,
              ssas.recommended_time,
               
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
              assessed_section_id
              
         FROM section_student_active_sparkpoint ssas
    LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
          AND ss.student_id = ssas.student_id
         JOIN sparkpoints sp ON sp.id = ssas.sparkpoint_id
         JOIN course_sections cs ON cs."ID" = ssas.section_id
        WHERE ssas.section_id = $1
          ${          studentWhere}
     ORDER BY ssas.last_accessed DESC
    `, [
        sectionId,
        studentId,
    ]);
}

module.exports = {
    get: getHandler,
};
