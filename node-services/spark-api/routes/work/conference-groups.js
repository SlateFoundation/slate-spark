'use strict';

var util = require('../../lib/util'),
    allowNull = util.allowNull,
    isString = util.isString,
    fieldValidators = {
        id: allowNull(util.isGtZero),
        section_id: isString,
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
        errorList.push('You must pass either an id or a section_id to identify the group.');
    }

    if (errorList.length > 0 && errors === undefined) {
        group.errors = errorList;
    }

    return group;
}

function *getHandler() {
    var where = ['closed_time IS NULL'],
        id = util.isGteZero(this.query.id) ? this.query.id : null,
        sectionId = this.query.section_id,
        vals = [],
        limit = util.isGteZero(this.query.limit) ? `LIMIT ${limit}` : 'LIMIT 50';

    // use section_id in query, but not if PK is also included
    if (!id && sectionId) {
        where.push('section_id = $1');
        vals.push(sectionId);
    } else if (id) {
        where.push('id = $1');
        vals.push(id);
    }

    this.body = yield this.pgp.manyOrNone(`
        SELECT * FROM conference_groups WHERE ${where.join(' AND ')} ${limit}`, vals
    );
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

    conferenceGroups.forEach(function(group) {

        validateConferenceGroup(group, errors);

        // HACK: Temporary workaround for not-null constraint failing
        // BETTER HACK: SET section_id = EXCLUDED.section_id (we'd need to modify or throw out query builder)
        if (group.id && !group.section_id) {
            group.section_id = this.request.section_id;
        }

        for (let prop in group) {
            _.push('conference_groups', prop, group[prop]);
        }

        group.queries = [recordQueries.push(_.getUpsert('conference_groups', ['id'], true)) - 1];
    });

    this.body = conferenceGroups;

    if (errors.length > 0) {
        this.throw(new Error(errors.join(', ')), 400);
        return;
    }

    this.body = yield* util.groupQueries(recordQueries, _.values, conferenceGroups, this);

}

module.exports = {
    get: getHandler,
    patch: patchHandler
};
