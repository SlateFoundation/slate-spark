'use strict';

const util = require('../lib/util');

/* language=SQL */ `

CREATE TABLE section_timers (
  section_id INTEGER PRIMARY KEY,
  teacher_id INTEGER,
  started TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  paused integer DEFAULT NULL
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

function *patchHandler() {
    var ctx = this,
        timer = util.identifyRecordSync(ctx.request.body || {}, ctx.lookup),
        sectionId = timer.section_id,
        teacherId = timer.teacher_id || ctx.userId,
        paused = typeof timer.paused === 'boolean' ? !!timer.paused : false;

    ctx.assert(ctx.isTeacher, 400, 'Only teachers can set timers');
    ctx.assert(sectionId, 400, 'section_id is required');
    ctx.assert(ctx.userId === teacherId || ctx.isDeveloper, 403, 'Only developers can set timers as another user.');

    try {
        if (paused) {
            timer = yield ctx.pgp.one(/*language=SQL*/ `
        UPDATE section_timers
           SET paused = duration_seconds - EXTRACT(EPOCH FROM (current_timestamp - started))
         WHERE section_id = $1
           AND teacher_id = $2
           AND paused IS NULL
     RETURNING *`,
                [sectionId, teacherId]
            );
        } else {
            timer = yield ctx.pgp.one(/*language=SQL*/ `
          UPDATE section_timers
             SET paused = null,
                 started = (current_timestamp - ((duration_seconds - paused) || ' seconds'::TEXT)::INTERVAL)
           WHERE section_id = $1
             AND teacher_id = $2
             AND paused IS NOT NULL
       RETURNING *`,
                [sectionId, teacherId]
            );
        }
    } catch (e) {
        var action = paused ? 'unpause' : 'pause',
            state = paused ? 'a paused': 'an unpaused';

        ctx.throw(400, new Error(`You cannot ${action} ${state} timer.`));
    }

    ctx.body = util.codifyRecord(timer, ctx.lookup);
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

    timer.paused = null;

    timer = yield ctx.pgp.one(
        util.recordToUpsert.call(ctx, 'section_timers', timer, vals) + ' RETURNING *;',
        vals.vals
    );

    ctx.body = util.codifyRecord(timer, ctx.lookup);
}

module.exports = {
  get: getHandler,
  put: putHandler,
  patch: patchHandler
};
