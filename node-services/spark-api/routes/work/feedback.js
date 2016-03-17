'use strict';

/*
 SET search_path = "$school", "spark", "public";

 CREATE TABLE teacher_feedback (
 id serial primary key,
 student_id integer NOT NULL,
 author_id integer NOT NULL,
 sparkpoint_id character(8) NOT NULL,
 phase gps_phase NOT NULL,
 message text NOT NULL,
 created_time timestamp without time zone DEFAULT now() NOT NULL
 );


 ALTER TABLE teacher_feedback OWNER TO "$school";

 CREATE INDEX teacher_feedback_student_id_sparkpoint_id_idx ON teacher_feedback(student_id);
 CREATE INDEX teacher_feedback_sparkpoint_id_phase_sparkpoint_id_idx ON teacher_feedback(sparkpoint_id, phase);
 CREATE INDEX teacher_feedback_author_id_idx ON teacher_feedback(author_id);
 */

var util = require('../../lib/util');


function *getHandler() {
    var ctx = this,
        teacherFeedback = yield util.selectFromRequest.call(ctx, 'teacher_feedback');

    // HACK: This works around the session middleware injecting the logged in student_id into this.query automatically
    if (!ctx.hadStudentIdInQuery) {
        delete ctx.query.student_id;
    }

    ctx.body = teacherFeedback.map(function (teacherFeedback) {
        return util.namifyRecord(util.codifyRecord(teacherFeedback, ctx.lookup), ctx.lookup);
    });
}


function *patchHandler() {
    var ctx = this,
        teacherFeedback = ctx.request.body,
        vals = new util.Values(),
        recordToInsert = util.recordToInsert.bind(ctx),
        records,
        sql;

    // Request validation
    ctx.assert(Array.isArray(teacherFeedback), 'The request body must be a JSON array of feedback objects', 400);
    ctx.assert(teacherFeedback.length > 0, 'The request body must contain one or more feedback objects', 400);
    ctx.assert(!ctx.isStudent, 'Students cannot post teacher feedback', 403);

    teacherFeedback.forEach(feedback => feedback.author_id = feedback.author_id || ctx.userId);

    records = util.validateRecordSet(ctx, 'teacher_feedback', teacherFeedback);

    if (records.success === false) {
        return;
    }

    sql = util.queriesToReturningCte(records.map(record => recordToInsert('teacher_feedback', record, vals)));

    ctx.body = yield ctx.pgp.any(sql, vals.vals);
}


module.exports = {
    get: getHandler,
    post: patchHandler,
    patch: patchHandler
};