'use strict';

async function getHandler(ctx, next) {
    var currentLimit = parseInt(ctx.query.current, 10) || 5,
        queuedLimit = parseInt(ctx.query.queued, 10) || 5,
        pastLimit = parseInt(ctx.query.past, 10) || 5,
        studentId = ctx.isStudent ? ctx.studentId : ~~ctx.query.student_id,
        sectionId = ~~ctx.query.section_id,
        results;

    ctx.assert(sectionId > 0, 'section_id is required', 400);
    ctx.assert(studentId > 0, 'Non-student users must provide a student_id', 400);

    results = await ctx.pgp.any(/*language=SQL*/ `
        WITH past AS (
            SELECT ss.*,
    
                   ssas.last_accessed,
                   ssas.section_id,
                   ssas.recommender_id,
                   ssas.recommended_time
    
              FROM section_student_active_sparkpoint ssas
         LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
             WHERE ssas.section_id = $2
               AND ss.apply_finish_time IS NOT NULL
               AND ssas.student_id = $1
          ORDER BY ssas.last_accessed DESC
             LIMIT $3
         ),
    
         current AS (
            SELECT ss.*,
            
                   ssas.last_accessed,
                   ssas.section_id,
                   ssas.recommender_id,
                   ssas.recommended_time
    
              FROM section_student_active_sparkpoint ssas
        RIGHT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
             WHERE ssas.section_id = $2
               AND ssas.student_id = $1
               AND ss.apply_finish_time IS NULL
          ORDER BY ssas.last_accessed DESC
             LIMIT $4
         ),
    
        queued AS (
            SELECT ss.*,
    
                   ssas.last_accessed,
                   ssas.section_id,
                   ssas.recommender_id,
                   ssas.recommended_time
    
              FROM section_student_active_sparkpoint ssas
         LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
             WHERE ssas.section_id = $2
               AND ssas.student_id = $1
               AND ss.learn_start_time IS NULL
          ORDER BY ssas.recommended_time DESC, ssas.last_accessed DESC
           LIMIT $5
       ),
    
       combined_sparkpoints AS (
        SELECT * FROM queued
        UNION DISTINCT
        SELECT * FROM current
        UNION DISTINCT
        SELECT * FROM past
       )
    
    
    SELECT combined_sparkpoints.*,
           sp.id,
           sp.code,
           sp.student_title,
           cs."Code" AS section
      FROM combined_sparkpoints
      JOIN course_sections cs ON cs."ID" = combined_sparkpoints.section_id
      JOIN sparkpoints sp ON sp.id = combined_sparkpoints.sparkpoint_id
    `, [
        studentId,
        sectionId,
        pastLimit,
        currentLimit,
        queuedLimit
    ]);

    ctx.body = results || [];
}

module.exports = {
    get: getHandler
};
