'use strict';

const util = require('../lib/util');

/* language=SQL */ `

CREATE TABLE section_timers (
  section_id INTEGER PRIMARY KEY,
  teacher_id INTEGER,
  started TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0)
);
`

function *getHandler() {
    var ctx = this,
        sectionId = ctx.query.section_id,
        params = Object.assign(
            ctx.isStudent ? { section_id: sectionId } : { teacher_id: ctx.userId },
            ctx.query
        ),
        vals = new util.Values(),
        where = util.recordToWhere(params, vals);

    ctx.body = yield ctx.pgp.any(/* language=SQL */  `
      SELECT section_timers.*,
             cs."Code" AS section_code
        FROM section_timers
        JOIN course_sections cs ON cs."ID" = section_id
        ${where}
    `, vals.vals);
}

function *putHandler() {
    var ctx = this,
        timer = util.identifyRecordSync(ctx.request.body || {}, ctx.lookup),
        duration = parseInt(timer.duration_seconds, 10),
        sectionId = timer.section_id,
        teacherId = timer.teacher_id || ctx.userId,
        vals = new util.Values();

    ctx.assert(ctx.isTeacher, 400, 'Only teachers can set timers');
    ctx.assert(!isNaN(duration), 400, 'duration_seconds is required; set to 0 to clear');
    ctx.assert(sectionId, 400, 'section_id is required');
    ctx.assert(ctx.userId === teacherId || ctx.isDeveloper, 403, 'Only developers can set timers as another user.');

    timer.teacher_id = teacherId;

    if (duration === 0) {
        timer.started = null;
        delete timer.duration_seconds;
    } else {
        timer.started = new Date();
    }

    timer = yield ctx.pgp.one(
        util.recordToUpsert.call(ctx, 'section_timers', timer, vals) + ' RETURNING *;',
        vals.vals
    );

    ctx.body = util.codifyRecord(timer, ctx.lookup);
}

module.exports = {
  get: getHandler,
  put: putHandler
};
