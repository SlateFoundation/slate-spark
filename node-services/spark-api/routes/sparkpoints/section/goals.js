'use strict';

const util = require('../../../lib/util');

/* TODO: Move this into the proper Git repo during schema update
 CREATE TABLE IF NOT EXISTS term_section_student_sparkpoint_goals (
     term_id integer,
     section_id integer,
     student_id integer,
     goal integer,
     PRIMARY KEY(term_id, section_id, student_id)
 );
 */

async function getHandler(ctx, next) {
    var sectionId = ~~ctx.query.section_id;

    ctx.assert(sectionId > 0, 'section_id is required', 400);

    ctx.body = await ctx.pgp.any(/*language=SQL*/ `
      SELECT tsssg.*,
             terms."Title" AS term_title,
             terms."Handle" AS term_code,
             course_sections."Code" AS section_code
        FROM term_section_student_sparkpoint_goals tsssg
   LEFT JOIN terms ON terms."ID" = tsssg.term_id
   LEFT JOIN course_sections ON course_sections."ID" = tsssg.section_id
       WHERE tsssg.section_id = $1
    `, [sectionId]);
}

async function postHandler(ctx, next) {
    var tableName = 'term_section_student_sparkpoint_goals',
        goals = ctx.request.body,
        vals = new util.Values(),
        recordToUpsert = util.recordToUpsert.bind(ctx),
        identifyRecordSync = util.identifyRecordSync,
        records,
        sql;

    ctx.assert(Array.isArray(goals), 'The request body must be an array of goals objects.', 400);

    /*records = util.validateRecordSet(ctx, tableName, goals);

    if (records.success === false) {
        return;
    }*/

    goals = goals.map(function(goal) {
        var record = identifyRecordSync(goal, ctx.lookup);
        record.term_id = 1;
        return record;
    });

    sql = util.queriesToReturningCte(
        goals.map(record => recordToUpsert(tableName, record, vals, ['term_id', 'section_id', 'student_id']))
    );

    await ctx.pgp.any(sql, vals.vals);

    ctx.body = {
        success: true
    };
}

module.exports = {
    get: getHandler,
    post: postHandler
};
