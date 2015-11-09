'use strict';

/*
 CREATE TABLE IF NOT EXISTS mastery_check_scores (
 id serial PRIMARY KEY,
 student_id integer NOT NULL,
 sparkpoint_id char(8) NOT NULL,
 phase gps_phase NOT NULL,
 score smallint NOT NULL,
 teacher_id integer DEFAULT current_setting('spark.user_id')::integer NOT NULL,
 created_on timestamp DEFAULT current_timestamp NOT NULL,

 UNIQUE (student_id, sparkpoint_id, phase)
 );
 */

var util = require('../../lib/util')

const SEARCH_COLUMNS = ['phase', 'sparkpoint_id', 'student_id', 'teacher_id'];
const PHASES = ['learn', 'conference'];
const REQUIRED_COLUMNS = ['student_id', 'teacher_id', 'sparkpoint_id', 'phase', 'score'];

function validateMasteryCheckScore(masteryCheckScore) {
    var normalized = {};

    masteryCheckScore = masteryCheckScore || {};

    var errors = [],
        sparkpointId = util.toSparkpointId(masteryCheckScore.sparkpoint_id || masteryCheckScore.sparkpoint);

    // phase
    if (PHASES.indexOf(masteryCheckScore.phase) === -1) {
        errors.push('Invalid phase: ' + masteryCheckScore.phase);
    } else {
        normalized.phase = masteryCheckScore.phase;
    }

    // sparkpoint / sparkpoint_id
    if (!sparkpointId) {
        errors.push('Invalid sparkpoint: ' + masteryCheckScore.sparkpoint_id || masteryCheckScore.sparkpoint);
    } else {
        normalized.sparkpoint_id = sparkpointId;
    }

    // student_id
    if (isNaN(parseInt(masteryCheckScore.student_id, 10))) {
        errors.push('student_id must be numeric, not: ' + masteryCheckScore.student_id);
    } else {
        normalized.student_id = masteryCheckScore.student_id;
    }

    // teacher_id
    if (masteryCheckScore.teacher_id) {
        if (!Number.isInteger(masteryCheckScore.teacher_id)) {
            errors.push('teacher_id must be numeric, not: ' + masteryCheckScore.teacher_id);
        } else if (masteryCheckScore.teacher_id !== this.userId && !this.isDeveloper) {
            errors.push(`teacher_id must match the currently logged in user or be omitted: ${masteryCheckScore.teacher_id} != ${this.userId}`);
        } else {
            normalized.teacher_id = masteryCheckScore.teacher_id;
        }
    } else {
        normalized.teacher_id = this.userId;
    }

    // score
    if (typeof masteryCheckScore.score !== 'number' || (masteryCheckScore.score < 0 || masteryCheckScore.score > 100)) {
        errors.push('score must be a number between 1-100, not: ' + masteryCheckScore.score);
    } else {
        normalized.score = masteryCheckScore.score;
    }

    if (errors.length > 0) {
        masteryCheckScore.errors = errors;
        return masteryCheckScore;
    }

    return normalized;
}

function *getHandler() {
    this.require(['student_id']);

    var query = {},
        masteryCheckScores;

    Object.keys(this.query)
        .filter(key => SEARCH_COLUMNS.indexOf(key) !== -1)
        .forEach(key => query[key] = this.query[key]);

    if (query.phase && PHASES.indexOf(query.phase) === -1) {
        this.throw(new Error(`Invalid learning phase: ${query.phase}, allowed values are: ${PHASES.join(', ')}`), 400);
    }

    masteryCheckScores = yield this.knex('mastery_check_scores')
        .join('people', 'mastery_check_scores.teacher_id', 'people.ID')
        .select('mastery_check_scores.*', this.knex.raw(`(people."FirstName" || ' ' || people."LastName") AS teacher_name`))
        .where(query);

    this.body = masteryCheckScores.map(function(masteryCheckScore) {
        masteryCheckScore.sparkpoint = util.toSparkpointCode(masteryCheckScore.sparkpoint_id);
        return masteryCheckScore;
    });
}

function *patchHandler() {
    var masteryCheckScores = this.request.body,
        ctx = this,
        rejected = [],
        query,
        values = [],
        placeholders = [],
        x = 0,
        teacherIds = {},
        feedbackItems,
        people,
        teacherNames = {};

    if (!Array.isArray(masteryCheckScores) || masteryCheckScores.length === 0) {
        this.throw(new Error('Request body should be a JSON array of one or more mastery check scores'), 400);
    }

    if (this.isStudent) {
        this.throw(new Error('Students cannot post mastery check scores'), 403);
    }

    masteryCheckScores.forEach(function(masteryCheckScore) {
        masteryCheckScore = validateMasteryCheckScore.apply(ctx, arguments);

        if (masteryCheckScore.errors) {
            rejected.push(masteryCheckScore);
        } else {
            teacherIds[masteryCheckScore.teacher_id] = true;
            REQUIRED_COLUMNS.forEach(key => values.push(masteryCheckScore[key]));
            placeholders.push(`($${++x}, $${++x}, $${++x}, $${++x}, $${++x})`);
        }

        return masteryCheckScore;
    });

    if (rejected.length > 0) {
        this.status = 400;

        return this.body = {
            rejected: rejected,
            error: 'POST request rejected due to invalid mastery check scores, see "rejected" for details.'
        };
    }

    query = `INSERT INTO mastery_check_scores (${REQUIRED_COLUMNS.join(', ')}) VALUES
        ${placeholders.join(',\n')} ON CONFLICT (sparkpoint_id, phase, student_id) DO UPDATE SET
    score = EXCLUDED.score
    WHERE mastery_check_scores.score != EXCLUDED.score
    RETURNING *;`;

    people = yield this
        .knex('people')
        .select('ID', this.knex.raw(`(people."FirstName" || ' ' || people."LastName") AS teacher_name`))
        .whereIn('ID', Object.keys(teacherIds));

    people.forEach(function(person) {
        teacherNames[person.ID] = person.teacher_name;
    });

    masteryCheckScores = yield this.pgp.manyOrNone(query, values);

    this.body = masteryCheckScores.map(function(masteryCheckScore) {
        masteryCheckScore.teacher_name = teacherNames[masteryCheckScore.teacher_id];
        return masteryCheckScore;
    });
}

module.exports = {
    get: getHandler,
    patch: patchHandler
};
