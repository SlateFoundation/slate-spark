'use strict';

var util = require('../../lib/util'),
    allowNull = util.allowNull,
    isString = util.isString,
    fieldValidators = {
        id: allowNull(util.isGtZero),
        section_id: allowNull(util.isGteZero),
        section_code: allowNull(isString),
        opened_time: allowNull(util.isDate),
        timer_time: allowNull(util.isDate),
        closed_time: allowNull(util.isDate),
        accrued_seconds: allowNull(util.isGteZero)
    };

/*
 set search_path = "sandbox-school", "spark", "public";

 CREATE TABLE IF NOT EXISTS conference_groups (
 id serial PRIMARY KEY,
 section_id text NOT NULL,
 opened_time timestamp DEFAULT current_timestamp NOT NULL,
 timer_time timestamp DEFAULT current_timestamp,
 closed_time timestamp,
 accrued_seconds integer NOT NULL
 );

 CREATE INDEX IF NOT EXISTS conference_groups_section_id_idx ON conference_groups(section_id);

 ALTER TABLE conference_groups OWNER TO "sandbox-school";
 */


function validateConferenceGroup(group, errors) {
    var errorList = errors || [];

    for (var prop in group) {
        let validator = fieldValidators[prop];

        if (!validator) {
            errorList.push('Unexpected key: ' + prop);
        } else if (!validator(group[prop])) {
            errorList.push(`Invalid value for ${prop}: ${group[prop]}`);
        }
    }

    if (!group.id && !group.section_id) {
        errorList.push('You must pass either a (group) id, section_id or section_code to identify the group.');
    }

    if (errorList.length > 0 && errors === undefined) {
        group.errors = errorList;
    }

    return group;
}

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
        query = `SELECT *
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
    var conferenceGroups = this.request.body,
        _ = new util.QueryBuilder(),
        recordQueries = [],
        ctx = this,
        errors = [];

    if (!Array.isArray(conferenceGroups)) {
        this.throw(new Error('The request body should be a JSON array of conference group objects'), 400);
    }

    if (!this.isTeacher) {
        this.throw(new Error('This is a teacher only endpoint.'), 403);
        return;
    }

    conferenceGroups.forEach(function (group) {

        if (group.section_code) {
            group.section_id = ctx.lookup.section.cache.codeToId[group.section_code.toLowerCase()];
            delete group.section_code;
        }

        validateConferenceGroup(group, errors);

        // Accept numeric times
        for (let prop in group) {
            let val = group[prop];

            if (prop.slice(-5) === '_time') {
                if (val === null) {
                    group[prop] = null;
                } else {
                    val = parseInt(val, 10);

                    if (!isNaN(val)) {
                        group[prop] = new Date(val * 1000).toUTCString();
                    } else {
                        ctx.throw(new Error(
                            `${prop} must be null or the number of seconds since epoch; you provided: ${group[prop]}`
                        ), 400);
                    }
                }
            }
        }

        // HACK: Temporary workaround for not-null constraint failing
        // BETTER HACK: SET section_id = EXCLUDED.section_id (we'd need to modify or throw out query builder)
        if (group.id && !group.section_id) {
            group.section_id = ctx.query.section_id;
        }

        for (let prop in group) {
            _.push('conference_groups', prop, group[prop]);
        }

        group.queries = [recordQueries.push(_.getUpsert('conference_groups', ['id'], true)) - 1];
    });

    if (errors.length > 0) {
        this.throw(new Error(errors.join(', ')), 400);
        return;
    }

    let results = yield* util.groupQueries(recordQueries, _.values, conferenceGroups, this);

    this.body = results.map(function (group) {
        group.section_code = ctx.lookup.section.cache.idToCode[group.section_id];
        return group;
    });
}

module.exports = {
    get: getHandler,
    patch: patchHandler
};
