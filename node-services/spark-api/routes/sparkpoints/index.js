'use strict';

function *getHandler() {
    var ctx = this,
        sectionId = ~~ctx.query.section_id,
        studentId = ~~ctx.query.student_id,
        studentWhere = (studentId > 0) ? 'AND ssas.student_id = $2' : '';

    ctx.assert(sectionId > 0, 'section_id is required', 400);

    ctx.body = yield ctx.pgp.any(/*language=SQL*/ `
       SELECT sp.id,
              sp.code AS sparkpoint,
              -- TODO: check with @rgipson to see when we can remove code
              sp.code,
              sp.student_title,
              ss.*,
              ssas.last_accessed,
              ssas.section_id,
              ssas.recommender_id,
              ssas.recommended_time
         FROM section_student_active_sparkpoint ssas
    LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
          AND ss.student_id = ssas.student_id
         JOIN sparkpoints sp ON sp.id = ssas.sparkpoint_id
        WHERE ssas.section_id = $1
          ${studentWhere}
     ORDER BY ssas.last_accessed DESC
    `, [
        sectionId,
        studentId
    ]);
}

module.exports = {
    get: getHandler
};
