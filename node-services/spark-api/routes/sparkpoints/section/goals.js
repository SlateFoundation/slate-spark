'use strict';

const util = require('../../../lib/util');

/* TODO: Move this into the proper Git repo during schema update
 CREATE TABLE IF NOT EXISTS term_section_student_sparkpoint_goals (
     term_id integer,
     section_id integer,
     student_id integer,
     sparkpoint_id char(8) REFERENCES public.sparkpoints (id),
     goal integer,
     PRIMARY KEY(term_id, section_id, student_id, sparkpoint_id)
 );
 */

function *getHandler() {
    var ctx = this,
        sectionId = ~~ctx.query.section_id;

    ctx.assert(sectionId > 0, 'section_id is required', 400);

    ctx.body = yield ctx.pgp.any(/*language=SQL*/ `
      SELECT tsssg.*,
             terms."Title" AS term_title,
             terms."Handle" AS term_handle,
             course_sections."Code" AS section_code,
             sparkpoints."code" AS sparkpoint_code
        FROM term_section_student_sparkpoint_goals tsssg
   LEFT JOIN terms ON terms."ID" = tsssg.term_id
   LEFT JOIN course_sections ON course_sections."ID" = tsssg.section_id
   LEFT JOIN sparkpoints ON sparkpoints.id = tsssg.sparkpoint_id
       WHERE tsssg.section_id = $1
    `, [sectionId]);
}

function *postHandler() {
    var ctx = this,
        tableName = 'term_section_student_sparkpoint_goals',
        goals = ctx.request.body,
        vals = new util.Values(),
        recordToInsert = util.recordToInsert.bind(ctx),
        records,
        sql;

    ctx.assert(Array.isArray(goals), 'The request body must be an array of goals objects.', 400);

    records = util.validateRecordSet(ctx, tableName, goals);

    if (records.success === false) {
        return;
    }

    sql = util.queriesToReturningCte(records.map(record => recordToInsert(tableName, record, vals)));

    yield ctx.pgp.any(sql, vals.vals);

    ctx.body = {
        success: true
    };
}

module.exports = {
    get: getHandler,
    post: postHandler
};
