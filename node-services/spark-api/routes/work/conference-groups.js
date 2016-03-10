'use strict';

var util = require('../../lib/util');

function *getHandler() {
    var id = util.isGteZero(this.query.id) ? this.query.id : null,
        sectionId = this.query.section_id,
        limit = util.isGtZero(this.query.limit) ? this.query.limit : 50,
        offset = util.isGteZero(this.query.offset) ? this.query.offset : 0,
        query;

    if (id) {
        query = `
        SELECT *
          FROM conference_groups
         WHERE id = $1`;

        this.body = yield this.pgp.any(query, id);
    } else {
        query = `
             SELECT *
               FROM conference_groups
              WHERE section_id = $1
                AND closed_time IS NULL OR id = ANY(SELECT conference_group_id FROM (
                   SELECT student_id,
                          sparkpoint_id,
                          section_id,
                          last_accessed,
                          ROW_NUMBER() OVER (
                            PARTITION BY ssas.student_id,
                                         ssas.section_id
                                ORDER BY ssas.last_accessed DESC
                          ) AS rn
                     FROM section_student_active_sparkpoint ssas
                    WHERE section_id = $1
                      AND last_accessed IS NOT NULL
                 ) t
                 JOIN student_sparkpoint ss ON ss.sparkpoint_id = t.sparkpoint_id
                  AND ss.student_id = t.student_id
                  AND ss.conference_group_id IS NOT NULL
                WHERE t.rn = 1
             ) ORDER BY opened_time
               OFFSET $2
               LIMIT $3
           `;

        this.body = yield this.pgp.any(query, [sectionId, offset, limit]);
    }
}

function *patchHandler() {
    var ctx = this,
        conferenceGroups = ctx.request.body,
        recordToInsert = util.recordToInsert.bind(ctx),
        vals = new util.Values(),
        sql,
        results;

    ctx.assert(Array.isArray(conferenceGroups), 'The request body should be a JSON array of conference group objects', 400);
    ctx.assert(ctx.isTeacher, 'This is a teacher only endpoint.', 403);

    sql = util.queriesToReturningCte(conferenceGroups.map(function (group) {
        let errors;

        // TODO: hack until the client stops sending invalid section_ids
        if (group.section_id === 0) {
            delete group.section_id;
        }

        group = util.identifyRecord(group, ctx.lookup);

        // Accept numeric times
        for (let prop in group) {
            let val = group[prop];

            if (prop.slice(-5) === '_time') {
                if (val === null) {
                    group[prop] = null;
                } else {
                    val = parseInt(val, 10);

                    ctx.assert(!isNaN(val), 400,
                        `${prop} must be null or the number of seconds since epoch; you provided: ${group[prop]}`
                    );

                    group[prop] = new Date(val * 1000).toUTCString();
                }
            }
        }

        // HACK: Temporary workaround for not-null constraint failing
        // BETTER HACK: SET section_id = EXCLUDED.section_id (we'd need to modify or throw out query builder)
        if (group.id && !group.section_id) {
            group.section_id = ctx.query.section_id;
        }

        errors = ctx.validation['conference_groups'](group);

        if (errors) {
            ctx.throw(400, new Error(errors.join('\n')));
        }

        return recordToInsert('conference_groups', group, vals);
    }));

    results = yield ctx.pgp.any(sql, vals.vals);

    ctx.body = results.map(group => util.codifyRecord(group, ctx.lookup));
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    post: patchHandler
};
