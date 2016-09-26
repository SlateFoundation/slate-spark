'use strict';

function* getHandler() {
    var ctx = this,
        currentLimit = parseInt(ctx.query.current, 10) || 5,
        queuedLimit = parseInt(ctx.query.queued, 10) || 5,
        pastLimit = parseInt(ctx.query.past, 10) || 5,
        studentId = ctx.isStudent ? ctx.studentId : ~~ctx.query.student_id,
        sectionId = ~~ctx.query.section_id,
        results;

    ctx.assert(sectionId > 0, 'section_id is required', 400);
    ctx.assert(studentId > 0, 'Non-student users must provide a student_id', 400);

    results = yield ctx.pgp.one(/*language=SQL*/ `
    WITH past AS (
            SELECT sp.id,
                   sp.code,
                   sp.student_title,
                   
                   ss.*,
                   
                   ssas.last_accessed,
                   ssas.section_id,
                   ssas.recommender_id,
                   ssas.recommended_time
                   
              FROM section_student_active_sparkpoint ssas
         LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
              JOIN sparkpoints sp ON sp.id = ssas.sparkpoint_id
             WHERE ssas.section_id = $2
               AND ss.apply_finish_time IS NOT NULL
               AND ssas.student_id = $1
          ORDER BY ssas.last_accessed DESC
             LIMIT $3
         ),

         current AS (
            SELECT sp.id,
                   sp.code,
                   sp.student_title,
                   
                   ss.*,
                   
                   ssas.last_accessed,
                   ssas.section_id,
                   ssas.recommender_id,
                   ssas.recommended_time
                   
              FROM section_student_active_sparkpoint ssas
        RIGHT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
              JOIN sparkpoints sp ON sp.id = ssas.sparkpoint_id
             WHERE ssas.section_id = $2
               AND ssas.student_id = $1
               AND ss.apply_finish_time IS NULL
          ORDER BY ssas.last_accessed DESC
             LIMIT $4
         ),

        queued AS (
            SELECT sp.id,
                   sp.code,
                   sp.student_title,
                   
                   ss.*,
                   
                   ssas.last_accessed,
                   ssas.section_id,
                   ssas.recommender_id,
                   ssas.recommended_time
                   
              FROM section_student_active_sparkpoint ssas
         LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
              JOIN sparkpoints sp ON sp.id = ssas.sparkpoint_id
             WHERE ssas.section_id = $2
               AND ssas.student_id = $1
               AND ss.learn_start_time IS NULL
          ORDER BY ssas.recommended_time DESC, ssas.last_accessed DESC
           LIMIT $5
       )

       SELECT json_agg(j) AS sparkpoints FROM (
            SELECT row_to_json(past) j FROM past
            UNION ALL
            SELECT row_to_json(current) j FROM current
            UNION ALL
            SELECT row_to_json(queued) j FROM queued
        ) t;`, [ studentId, sectionId, pastLimit, currentLimit, queuedLimit ]);

    ctx.body = results.sparkpoints || [];
}

function bustSuggestionCache() {
    console.log('Busting spark point suggestion cache...');

    for (var prop in suggestionCache) {
        delete suggestionCache[prop];
    }
}

module.exports = {
    get: getHandler,
    bustSuggestionCache: bustSuggestionCache
};
