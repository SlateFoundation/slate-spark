'use strict';

var util = require('../../lib/util'),
    QueryBuilder = util.QueryBuilder,
    AsnStandard = require('../../lib/asn-standard');

function *getHandler() {
    this.require(['sparkpoint_id', 'student_id']);

    var sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        applies;

    (this.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (standardIds.length === 0) {
        return this.throw(new Error('No academic standards are associated with spark point id: ' + sparkpointId), 404);
    }

    applies = yield this.pgp.one(/*language=SQL*/
    `
    SELECT json_agg(json_build_object(
        'id',
        ap.id,
        'title',
        ap.title,
        'instructions',
        ap.instructions,
        'dok',
        ap.dok,
        'gradeLevel',
        ap.gradelevel,
        'timeEstimate',
        ap.timeestimate,
        'sparkpointIds',
        (SELECT json_agg(id)
           FROM sparkpoints
          WHERE metadata->>'asn_id' = ANY($3)
        ),
        'sparkpointCodes',
        (SELECT json_agg(code)
           FROM sparkpoints
          WHERE metadata->>'asn_id' = ANY($3)
        ),
        'standardCodes',
        ap.standards,
        'todos',
        (SELECT json_agg(todo) FROM (
            SELECT json_build_object(
                       'id',
                       id,
                       'todo',
                       todo,
                       'completed',
                       completed
                   ) AS todo
            FROM todos
           WHERE user_id = $1
             AND apply_id = ap.id
           UNION ALL
           SELECT json_build_object(
                      'todo',
                      todo,
                      'completed',
                      false
                  ) AS todo
             FROM jsonb_array_elements(ap.todos) AS todo
        ) AS all_todos),
        'links',
        (SELECT CASE WHEN jsonb_typeof(link) = 'string'
                THEN jsonb_build_object('title', link, 'url', link)
                ELSE link
                END
         FROM jsonb_array_elements(ap.links) AS link
        ),
        'metadata',
        CASE
          WHEN ap.metadata = '""'
          THEN '{}'::JSONB
          ELSE ap.metadata::JSONB
        END,
        'selected',
        CASE WHEN a.selected IS NULL THEN false ELSE true END,
        'reflection',
        a.reflection,
        'submissions',
        a.submissions,
        'comment',
        ar.comment,
        'rating',
        ar.rating,
        'grade',
        a.grade,
        'graded_by',
        CASE WHEN a.graded_by IS NOT NULL
             THEN (SELECT "FirstName" || ' ' || "LastName" FROM people WHERE "ID" = a.graded_by)
             ELSE null
        END
    )) AS json
         FROM fusebox_apply_projects ap
    LEFT JOIN applies a ON a.fb_apply_id = ap.id
    LEFT JOIN apply_reviews ar ON ar.student_id = $1 AND ar.apply_id = ap.id
        WHERE standardids ?| $3;
    `, [this.student_id, sparkpointId, standardIds]);

    this.body = applies.json;
}

function *patchHandler() {
    this.require(['sparkpoint_id', 'student_id', 'id']);

    var sparkpointId = this.query.sparkpoint_id,
        studentId = this.studentId,
        selected = this.query.selected,
        id = parseInt(this.query.id, 10),
        reflection = this.query.reflection,
        grade = this.query.grade,
        rating = this.query.rating,
        comment = this.query.comment,
        apply,
        review,
        values = [],
        constraintKeys = ['sparkpoint_id', 'student_id', 'fb_apply_id'],
        todos,
        _ = new QueryBuilder();

    if (isNaN(id)) {
        this.throw(new Error('id must be an integer, you passed: ' + this.query.id), 400);
    }

    apply = {
        fb_apply_id: id,
        student_id: studentId,
        sparkpoint_id: sparkpointId,
    };

    if (typeof selected === 'boolean') {
        apply.selected = selected;
        _.push('applies', 'selected', apply.selected);
    }

    if (typeof reflection === 'string') {
        apply.reflection = reflection;
        _.push('applies', 'reflection', reflection);
    }

    if (typeof grade === 'number') {
        if (grade < 0 && grade > 4) {
            this.throw(new Error('Grades should be between 0-4'));
        } else if (!this.isTeacher) {
            this.throw(new Error('Only teachers can grade applies'), 403);
        } else {
            _.push('applies', 'grade', grade);
            _.push('applies', 'graded_by', this.userId);
            apply.grade = grade;
            apply.graded_by = this.userId;
        }
    }

    if (typeof rating === 'number') {
        _.push('apply_reviews', 'rating', rating);
    }

    if (typeof comment === 'string') {
        _.push('apply_reviews', 'comment', comment);
    }

    if (_.tables.applies) {
        _.push('applies', 'fb_apply_id', apply.fb_apply_id);
        _.push('applies', 'student_id', apply.student_id);
        _.push('applies', 'sparkpoint_id', apply.sparkpoint_id);

        let set = _.getSet('applies', constraintKeys);
        let values = _.getValues('applies');
        let columns = Object.keys(_.pop('applies').columns);

        apply = yield this.pgp.one(`
            INSERT INTO applies (${columns})
                         VALUES (${values}) ON CONFLICT (fb_apply_id, student_id, sparkpoint_id) DO UPDATE SET ${set}
            RETURNING *;`, _.values
        );
    }

    // Deselect other applies for student/sparkpoint and update the student_sparkpoint table
    if (selected !== undefined) {
        if (selected) {
            yield this.pgp.none(`
            UPDATE applies
               SET selected = false
             WHERE selected = true
               AND fb_apply_id != $1
               AND sparkpoint_id = $2
               AND student_id = $3;`,
                [id, sparkpointId, studentId]
            );

            yield this.pgp.none(`
            UPDATE student_sparkpoint
               SET selected_apply_id = $1,
                   selected_fb_apply_id = $2
             WHERE student_id = $3
               AND sparkpoint_id = $4
               AND (selected_fb_apply_id != $2 OR selected_fb_apply_id IS NULL)`,
                [apply.id, apply.fb_apply_id, studentId, sparkpointId]
            );
        } else {
            yield this.pgp.none(`
            UPDATE student_sparkpoint
               SET selected_apply_id = NULL,
                   selected_fb_apply_id = NULL
             WHERE student_id = $1
               AND sparkpoint_id = $2
               AND selected_fb_apply_id = $3;`,
                [studentId, sparkpointId, apply.fb_apply_id || apply.id]
            );
        }
    }

    if (_.tables.apply_reviews) {
        _.push('apply_reviews', 'apply_id', apply.fb_apply_id);
        _.push('apply_reviews', 'student_id', apply.student_id);

        let set = _.getSet('apply_reviews', ['apply_id', 'student_id']);
        let values = _.getValues('apply_reviews');
        let columns = Object.keys(_.pop('apply_reviews').columns);

        apply = yield this.pgp.one(`
            INSERT INTO apply_reviews (${columns})
                         VALUES (${values}) ON CONFLICT (apply_id, student_id) DO UPDATE SET ${set}
            RETURNING *;`, _.values
        );
    }

    // Selects todos from todos table, if they don't exist populate them from the fusebox and return them
    todos = yield this.pgp.manyOrNone(`
        WITH existing_user_todos AS (
          SELECT id,
                 todo,
                 completed
            FROM todos
           WHERE user_id = $1
             AND apply_id = $2
        ORDER BY id ASC
        ),

        todos AS (
            SELECT json_array_elements_text(todos::json) AS todo
              FROM fusebox_apply_projects
             WHERE id = $2 AND
             EXISTS(SELECT 1 FROM existing_user_todos) = false
        ),

        new_user_todos AS (
            INSERT INTO todos (user_id, apply_id, todo)
                SELECT $1 AS user_id,
                       $2 AS apply_id,
                       todo
                  FROM (SELECT todo FROM todos) t ON CONFLICT (user_id, apply_id, md5(todo)) DO NOTHING
            RETURNING id, todo, completed
        )

        SELECT * FROM existing_user_todos
        UNION ALL
        SELECT * FROM new_user_todos;
    `, [ studentId, id ]);

    if (review) {
        if (review.rating) {
            apply.rating = review.rating;
        }

        if (review.comment) {
            apply.comment = review.comment;
        }
    }

    apply.todos = todos;
    apply.id = apply.fb_apply_id;

    if (typeof apply.graded_by === 'number') {
        let graded_by = yield this.pgp.one(
            'SELECT "FirstName" || \' \' || "LastName" AS graded_by FROM people WHERE "ID" = $1 LIMIT 1',
            [apply.graded_by]);

        apply.graded_by =  graded_by.graded_by;
    }

    this.body = apply;
}

function *submissionsPostHandler() {
    this.require(['sparkpoint_id', 'id']);

    var sparkpointId = this.query.sparkpoint_id,
        id = parseInt(this.query.id, 10),
        submission = this.request.body;

    if (isNaN(id)) {
        return this.throw('id must be an integer, you passed: ' + this.query.id, 400);
    }

    if (typeof submission.url !== 'string') {
        return this.throw('url must be a string, you passed: ' + submission.url);
    }

    delete submission.id;

    this.body = yield this.pgp.one(`
            INSERT INTO applies (sparkpoint_id, student_id, fb_apply_id, submissions)
                         VALUES ($1, $2, $3, jsonb_build_array($4::JSONB)) ON CONFLICT (fb_apply_id, student_id, sparkpoint_id) DO UPDATE SET
                                submissions = jsonb_array_push_unique($4::JSONB, applies.submissions)
                       RETURNING *;`,
        [sparkpointId, this.studentId, id, submission]
    );
}

function *submissionsDeleteHandler() {
    this.require(['sparkpoint_id', 'id', 'url']);

    var sparkpointId = this.query.sparkpoint_id,
        id = parseInt(this.query.id, 10),
        submission = {
            sparkpoint: util.toSparkpointCode(sparkpointId),
            url: this.query.url
        };

    if (isNaN(id)) {
        return this.throw('id must be an integer, you passed: ' + this.query.id, 400);
    }

    if (typeof submission.url !== 'string') {
        return this.throw('url must be a string, you passed: ' + submission.url);
    }

    this.body = yield this.pgp.one(`
            UPDATE applies
               SET submissions = jsonb_remove_array_element($4::JSONB, submissions)
             WHERE sparkpoint_id = $1
               AND student_id = $2
               AND fb_apply_id = $3
         RETURNING *;`,
        [sparkpointId, this.studentId, id, submission]
    );
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    submissions: {
        post: submissionsPostHandler,
        delete: submissionsDeleteHandler
    }
};
