'use strict';

async function getHandler(ctx, next) {
    var sectionId = ctx.query.section_id;

    ctx.assert(ctx.isTeacher, 'You must be a teacher to use this endpoint', 403);
    ctx.assert(sectionId, 'You must provide a section, section_code or section_id as a query parameter', 400);

    ctx.body = await ctx.pgp.manyOrNone(/*language=SQL*/ `
        SELECT ssas.last_accessed,
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
               assessed_section_id,
               
               s.code AS sparkpoint,
               cs."Code" AS section_code
          FROM section_student_active_sparkpoint ssas
          JOIN student_sparkpoint ss ON ss.student_id = ssas.student_id
           AND ss.sparkpoint_id = ssas.sparkpoint_id
          JOIN sparkpoints s ON s.id = ssas.sparkpoint_id
          JOIN course_sections cs ON cs."ID" = ssas.section_id
         WHERE section_id = $1
           AND ssas.last_accessed IS NOT NULL
           AND (
                 (conference_start_time IS NOT NULL AND conference_join_time IS NULL)
                 OR (conference_join_time IS NOT NULL AND conference_finish_time IS NULL)
                 OR (apply_ready_time IS NOT NULL AND apply_finish_time IS NULL)
                 OR (assess_ready_time IS NOT NULL AND assess_finish_time IS NULL)
           )`,
        [sectionId]
    );
}

module.exports = {
    get: getHandler
};
