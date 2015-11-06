'use strict';

var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    util = require('../../lib/util'),
    QueryBuilder = util.QueryBuilder;

function *getHandler() {
    this.require(['sparkpoint_id', 'student_id']);

    var sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        applies;

    (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (standardIds.length === 0) {
        return this.throw(new Error('No academic standards are associated with spark point id: ' + sparkpointId), 404);
    }

    applies = yield this.pgp.manyOrNone(`
        SELECT *,
               (SELECT selected FROM applies a WHERE a.fb_apply_id = ap.id AND student_id = $2 AND sparkpoint_id = $3 LIMIT 1) AS selected,
               (SELECT reflection FROM applies a WHERE a.fb_apply_id = ap.id AND student_id = $2 AND sparkpoint_id = $3 LIMIT 1) AS reflection,
               (SELECT submissions FROM applies a WHERE a.fb_apply_id = ap.id AND student_id = $2 AND sparkpoint_id = $3 LIMIT 1) AS submissions,
               (SELECT grade FROM applies a WHERE a.fb_apply_id = ap.id AND student_id = $2 AND sparkpoint_id = $3 LIMIT 1) AS grade,
               (SELECT "FirstName" || \' \' || "LastName" FROM people WHERE "ID" = (SELECT graded_by FROM applies a WHERE a.fb_apply_id = ap.id AND student_id = $2 AND sparkpoint_id = $3 LIMIT 1)) AS graded_by,
               (SELECT json_agg(json_build_object('id', id, 'todo', todo, 'completed', completed)) FROM todos WHERE user_id = $2 AND apply_id = ap.id) AS my_todos,
               (SELECT row_to_json(reviews) FROM (SELECT rating, comment FROM apply_reviews WHERE student_id = $2 AND apply_id = ap.id) AS reviews) AS review
          FROM spark1.s2_apply_projects ap
         WHERE standardids::JSONB ?| $1`,
        [standardIds, this.studentId, sparkpointId]
    );

    this.body = applies.map(function (apply) {
        return {
            id: apply.id,
            title: apply.title,
            instructions: apply.instructions,
            gradeLevel: apply.gradeLevel,
            dok: apply.dok,
            sparkpointIds: util.toSparkpointIds(apply.standardids),
            sparkpointCodes: util.toSparkpointCodes(apply.standardids),
            standardCodes: util.toStandardCodes(apply.standardids),
            todos: (Array.isArray(apply.my_todos) && apply.my_todos.length > 0) ? apply.my_todos : (apply.todos || []).map(function(todo) { return { todo: todo }; }),
            links: (apply.links || []).filter(link => link !== '\n').map(link => link.toString().trim()),
            timeEstimate: apply.timestimate,
            metadata: apply.metadata === '""' ? {} : apply.metadata,
            selected: apply.selected || false,
            reflection: apply.reflection,
            submissions: apply.submissions || [],
            comment: apply.review ? apply.review.comment : null,
            rating: apply.review ? apply.review.rating : null,
            grade: apply.grade || null,
            graded_by: apply.graded_by || null
        };
    });
}

function *patchHandler() {
    this.require(['sparkpoint_id', 'student_id', 'id']);

    var sparkpointId = this.query.sparkpoint_id,
        studentId = this.studentId,
        selected = this.query.selected,
        id = parseInt(this.query.id, 10),
        reflection = this.query.reflection,
        submissions = this.query.submissions,
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
            this.throw(new Error('Grades should be between 1-4'));
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

    // Selecting a new apply should deselect other applies for that student and sparkpoint
    if (apply.selected) {
        yield this.pgp.none(`
        UPDATE applies
           SET selected = false
         WHERE selected = true
           AND fb_apply_id != $1
           AND sparkpoint_id = $2
           AND student_id = $3;`,
            [id, sparkpointId, studentId]
        );
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
              FROM spark1.s2_apply_projects
             WHERE id = $1 AND
             EXISTS(SELECT 1 FROM existing_user_todos) = false
        ),

        new_user_todos AS (
            INSERT INTO todos (user_id, apply_id, todo)
                SELECT $1 AS user_id,
                       $2 AS apply_id,
                       todo
                  FROM (SELECT todo FROM todos) AS t
            RETURNING id, todo, completed
        )

        SELECT * FROM existing_user_todos
        UNION ALL
        SELECT * FROM new_user_todos;
    `, [ id, studentId ]);

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
