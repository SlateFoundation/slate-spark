'use strict';

/*
 SET search_path = "sandbox-school", "spark", "public";

 CREATE TABLE IF NOT EXISTS teacher_feedback(
 id serial PRIMARY KEY,
 student_id integer,
 author_id integer,
 sparkpoint_id char(8) NOT NULL,
 phase gps_phase NOT NULL,
 message text NOT NULL,
 created_time timestamp DEFAULT current_timestamp NOT NULL,

 UNIQUE(sparkpoint_id, phase, student_id, author_id)
 );
 */

var util = require('../../lib/util');

const SEARCH_COLUMNS = ['phase', 'sparkpoint_id', 'student_id'];
const PHASES = ['learn', 'conference', 'apply', 'assess'];
const REQUIRED_COLUMNS = ['student_id', 'author_id', 'sparkpoint_id', 'phase', 'message'];

function validateFeedback(feedback) {
    var normalized = {};

    feedback = feedback || {};

    var errors = [],
        sparkpointId = util.toSparkpointId(feedback.sparkpoint_id || feedback.sparkpoint);

    // phase
    if (PHASES.indexOf(feedback.phase) === -1) {
        errors.push('Invalid phase: ' + feedback.phase);
    } else {
        normalized.phase = feedback.phase;
    }

    // sparkpoint / sparkpoint_id
    if (!sparkpointId) {
        errors.push('Invalid sparkpoint: ' + feedback.sparkpoint_id || feedback.sparkpoint);
    } else {
        normalized.sparkpoint_id = sparkpointId;
    }

    // student_id
    if (isNaN(parseInt(feedback.student_id, 10))) {
        errors.push('student_id must be numeric, not: ' + feedback.student_id);
    } else {
        normalized.student_id = feedback.student_id;
    }

    // author_id
    if (feedback.author_id) {
        if (!Number.isInteger(feedback.author_id)) {
            errors.push('author_id must be numeric, not: ' + feedback.author_id);
        } else if (feedback.author_id !== this.userId && !this.isDeveloper) {
            errors.push(`author_id must match the currently logged in user or be omitted: ${feedback.author_id} != ${this.userId}`);
        } else {
            normalized.author_id = feedback.author_id;
        }
    } else {
        normalized.author_id = this.userId;
    }

    // message
    if (typeof feedback.message !== 'string') {
        errors.push('message must be a string, not: ' + feedback.message);
    } else {
        normalized.message = feedback.message;
    }

    if (errors.length > 0) {
        feedback.errors = errors;
        return feedback;
    }

    return normalized;
}

function *getHandler() {
    this.require(['student_id']);

    var query = {},
        teacherFeedback;

    Object.keys(this.query)
        .filter(key => SEARCH_COLUMNS.indexOf(key) !== -1)
        .forEach(key => query[key] = this.query[key]);

    if (query.phase && PHASES.indexOf(query.phase)) {
        this.throw(new Error(`Invalid learning phase: ${query.phase}, allowed values are: ${PHASES.join(', ')}`), 400);
    }

    teacherFeedback = yield this.knex('teacher_feedback')
        .join('people', 'teacher_feedback.author_id', 'people.ID')
        .select('teacher_feedback.*', this.knex.raw(`(people."FirstName" || ' ' || people."LastName") AS author_name`))
        .where(query);

    this.body = teacherFeedback.map(function(feedback) {
        feedback.sparkpoint = util.toSparkpointCode(feedback.sparkpoint_id);
        return feedback;
    });
}

function *patchHandler() {
    var teacherFeedback = this.request.body,
        ctx = this,
        rejected = [],
        query,
        values = [],
        placeholders = [],
        x = 0,
        authorIds = {},
        feedbackItems,
        people,
        authorNames = {};

    if (!Array.isArray(teacherFeedback) || teacherFeedback.length === 0) {
        this.throw(new Error('Request body should be a JSON array of one or more feedback objects'), 400);
    }

    if (this.isStudent) {
        this.throw(new Error('Students cannot post feedback'), 403);
    }

    teacherFeedback.forEach(function(feedback) {
        feedback = validateFeedback.apply(ctx, arguments);

        if (feedback.errors) {
            rejected.push(feedback);
        } else {
            authorIds[feedback.author_id] = true;
            REQUIRED_COLUMNS.forEach(key => values.push(feedback[key]));
            placeholders.push(`($${++x}, $${++x}, $${++x}, $${++x}, $${++x})`);
        }

        return feedback;
    });

    if (rejected.length > 0) {
        this.status = 400;

        return this.body = {
            rejected: rejected,
            error: 'POST request rejected due to invalid feedback items, see "rejected" for details.'
        };
    }

    query = `INSERT INTO teacher_feedback (${REQUIRED_COLUMNS.join(', ')}) VALUES
        ${placeholders.join(',\n')} ON CONFLICT (sparkpoint_id, phase, student_id, author_id) DO UPDATE SET
    message = EXCLUDED.message
    WHERE teacher_feedback.message != EXCLUDED.message
    RETURNING *;`;

    people = yield this
        .knex('people')
        .select('ID', this.knex.raw(`(people."FirstName" || ' ' || people."LastName") AS author_name`))
        .whereIn('ID', Object.keys(authorIds));

    people.forEach(function(person) {
        authorNames[person.ID] = person.author_name;
    });

    feedbackItems = yield this.pgp.manyOrNone(query, values);

    this.body = feedbackItems.map(function(feedbackItem) {
        feedbackItem.author_name = authorNames[feedbackItem.author_id];
        return feedbackItem;
    });
}

module.exports = {
    get: getHandler,
    post: patchHandler,
    patch: patchHandler
};
