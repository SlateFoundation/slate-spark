'use strict';

var util = require('../../lib/util.js');

function *getHandler() {
    var ctx = this,
        sectionId = ctx.query.section_id,
        records;

    ctx.assert(ctx.isTeacher, 'You must be a teacher to use this endpoint', 403);
    ctx.assert(sectionId, 'You must provide a section, section_code or section_id as a query parameter', 400);

    records = yield ctx.pgp.manyOrNone(`
        SELECT t.last_accessed,
               t.section_id,
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
               selected_fb_apply_id,
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
                   ROW_NUMBER() OVER (
                     PARTITION BY ssas.student_id, ssas.section_id
                         ORDER BY ssas.last_accessed DESC) AS rn
              FROM section_student_active_sparkpoint ssas
             WHERE section_id = $1 AND last_accessed IS NOT NULL
          ) t
     LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = t.sparkpoint_id
           AND ss.student_id = t.student_id
          JOIN sparkpoints ON sparkpoints.id = t.sparkpoint_id
         WHERE t.rn = 1
           AND (conference_start_time IS NOT NULL AND conference_join_time IS NULL)
            OR (conference_join_time IS NOT NULL AND conference_finish_time IS NULL)
            OR (apply_ready_time IS NOT NULL AND apply_finish_time IS NULL)
            OR (assess_ready_time IS NOT NULL AND assess_finish_time IS NULL)`,
        [sectionId]
    );

    records.forEach(function(record) {
        record.section_code = ctx.lookup.section.cache.idToCode[record.section_id];
    });

    ctx.body = records;
}

module.exports = {
    get: getHandler
};
