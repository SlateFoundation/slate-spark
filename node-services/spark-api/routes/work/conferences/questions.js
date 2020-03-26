'use strict';

async function postHandler(ctx, next) {
    var sparkpointId = ctx.query.sparkpoint_id,
        studentId = ctx.isStudent ? ctx.studentId : ~~ctx.query.student_id,
        question = ctx.query.question,
        record;

    ctx.require(['sparkpoint_id', 'question']);
    ctx.assert(studentId > 0, 'Non-student users must pass a student_id', 400);

    record = await ctx.pgp.one(`
        INSERT INTO conference_questions
                    (student_id, sparkpoint_id, source, question)
             VALUES ($1, $2, $3, $4)
          RETURNING *;
          `,
        [
            studentId,
            sparkpointId,
            ctx.isStudent ? 'student' : 'teacher',
            question
        ]);

    record.sparkpoint = await ctx.lookup.sparkpoint.idToCode(record.sparkpoint_id);

    ctx.body = record;
}

module.exports = {
    post: postHandler
};
