'use strict';

var util = require('../../../lib/util'),
    QueryBuilder = util.QueryBuilder,
    AsnStandard = require('../../../lib/asn-standard');

function *getHandler() {
    this.require(['sparkpoint_id', 'section_id']);

    var ctx = this,
        sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        studentId = ctx.isStudent ? ctx.studentId : ~~ctx.query.student_id,
        sectionId = ~~this.query.section_id,
        applies;

    (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    // If standardIds is empty the query below will fail because PostgreSQL will not know it's array of integers
    ctx.assert(studentId > 0, 'Non-student users must pass a student_id', 400);
    ctx.assert(standardIds.length > 0, `No academic standards are associated with sparkpoint: ${sparkpointId}`, 400);

    applies = yield this.pgp.one(/*language=SQL*/
    `        
    SELECT json_agg(json_build_object(
        'id',
        ap.id,
        'resource_id',
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
        'standardCodes',
        ap.standards,
        'todos',
        COALESCE((CASE WHEN a.selected IS NULL
             THEN (
                SELECT json_agg(json_build_object(
                       'todo',
                       todo,
                       'completed',
                       false
                 )) AS todo
               FROM jsonb_array_elements(ap.todos) AS todo
             )
             ELSE (
                SELECT json_agg(todo) FROM (
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
                    AND apply_id = ap.id) AS student_todos
             )
         END), '[]'::JSON),
        'links',
        COALESCE((SELECT json_agg(
            CASE WHEN jsonb_typeof(link) = 'string'
                 THEN jsonb_build_object('title', link, 'url', link)
                 ELSE link
            END)
           FROM jsonb_array_elements(ap.links) AS link
        ), '[]'::JSON),
        'metadata',
        CASE
          WHEN ap.metadata = '""'
          THEN '{}'::JSONB
          ELSE ap.metadata::JSONB
        END,
        'selected',
        COALESCE(a.selected, false),
        'reflection',
        a.reflection,
        'submissions',
        COALESCE(a.submissions, '[]'::JSONB),
        'comment',
        ar.comment,
        'rating',
        json_build_object('user', ar.rating, 'student', null, 'teacher', null),
        'grade',
        a.grade,
        'graded_by',
        CASE WHEN a.graded_by IS NOT NULL
             THEN (SELECT "FirstName" || ' ' || "LastName" FROM people WHERE "ID" = a.graded_by)
             ELSE null
        END,
        'assignment',
        COALESCE((
          SELECT json_object_agg(
            (CASE WHEN aa.student_id IS NULL THEN 'section' ELSE 'student' END),
            assignment
          )
            FROM apply_assignments aa
           WHERE aa.resource_id = ap.id
             AND (aa.student_id = $1 OR aa.student_id IS NULL)
             AND aa.section_id = $4
          ), '{}':: JSON
        )
    )) AS json
         FROM fusebox_apply_projects ap
    LEFT JOIN applies a ON a.resource_id = ap.id AND a.student_id = $1
    LEFT JOIN apply_reviews ar ON ar.student_id = $1 AND ar.apply_id = ap.id
        WHERE standardids ?| $3;
    `, [this.studentId, sparkpointId, standardIds, sectionId]);

    ctx.body = applies.json || [];
}

function *patchHandler() {
    this.require(['sparkpoint_id']);

    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        studentId = ctx.isStudent ? ctx.studentId : ~~ctx.query.student_id,
        selected = ctx.query.selected,
        id = parseInt(ctx.query.id, 10) || parseInt(ctx.query.resource_id, 10),
        reflection = ctx.query.reflection,
        grade = ctx.query.grade,
        rating = ctx.query.rating,
        comment = ctx.query.comment,
        apply,
        review,
        values = [],
        constraintKeys = ['sparkpoint_id', 'student_id', 'resource_id'],
        todos,
        _ = new QueryBuilder();

    ctx.assert(studentId > 0, 'Non-student users must pass a student_id', 400);
    ctx.assert(!isNaN(id), `you must pass a numeric resource_id or id`, 400);

    apply = {
        resource_id: id,
        student_id: studentId,
        sparkpoint_id: sparkpointId
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
            ctx.throw(new Error('Grades should be between 0-4'));
        } else if (!ctx.isTeacher) {
            ctx.throw(new Error('Only teachers can grade applies'), 403);
        } else {
            _.push('applies', 'grade', grade);
            _.push('applies', 'graded_by', ctx.userId);
            apply.grade = grade;
            apply.graded_by = ctx.userId;
        }
    }

    if (typeof rating === 'number') {
        _.push('apply_reviews', 'rating', rating);
    }

    if (typeof comment === 'string') {
        _.push('apply_reviews', 'comment', comment);
    }

    if (_.tables.applies) {
        _.push('applies', 'resource_id', apply.resource_id);
        _.push('applies', 'student_id', apply.student_id);
        _.push('applies', 'sparkpoint_id', apply.sparkpoint_id);

        let set = _.getSet('applies', constraintKeys);
        let values = _.getValues('applies');
        let columns = Object.keys(_.pop('applies').columns);

        apply = yield ctx.pgp.one(`
            INSERT INTO applies (${columns})
                         VALUES (${values}) ON CONFLICT (resource_id, student_id, sparkpoint_id) DO UPDATE SET ${set}
            RETURNING *;`, _.values
        );
    }

    // TODO: [BEGIN] Convert this to database trigger
    // Deselect other applies for student/sparkpoint and update the student_sparkpoint table
    if (selected !== undefined) {
        if (selected) {
            yield ctx.pgp.none(/*language=SQL*/ `
            UPDATE applies
               SET selected = false
             WHERE selected = true
               AND resource_id != $1
               AND sparkpoint_id = $2
               AND student_id = $3;`,
                [id, sparkpointId, studentId]
            );

            yield ctx.pgp.none(/*language=SQL*/ `
            UPDATE student_sparkpoint
               SET selected_apply_id = $1,
                   selected_apply_resource_id = $2
             WHERE student_id = $3
               AND sparkpoint_id = $4
               AND (selected_apply_resource_id != $2 OR selected_apply_resource_id IS NULL)`,
                [apply.id, apply.resource_id, studentId, sparkpointId]
            );
        } else {
            yield ctx.pgp.none(/*language=SQL*/ `
            UPDATE student_sparkpoint
               SET selected_apply_id = NULL,
                   selected_apply_resource_id = NULL
             WHERE student_id = $1
               AND sparkpoint_id = $2
               AND selected_apply_resource_id = $3;`,
                [studentId, sparkpointId, apply.resource_id || apply.id]
            );
        }
    }
    // TODO: [END] Convert this to database trigger

    if (_.tables.apply_reviews) {
        _.push('apply_reviews', 'apply_id', apply.resource_id);
        _.push('apply_reviews', 'student_id', apply.student_id);

        let set = _.getSet('apply_reviews', ['apply_id', 'student_id']);
        let values = _.getValues('apply_reviews');
        let columns = Object.keys(_.pop('apply_reviews').columns);

        apply = yield ctx.pgp.one(`
            INSERT INTO apply_reviews (${columns})
                         VALUES (${values}) ON CONFLICT (apply_id, student_id) DO UPDATE SET ${set}
            RETURNING *;`, _.values
        );
    }

    // Selects todos from todos table, if they don't exist populate them from the fusebox and return them
    todos = yield ctx.pgp.manyOrNone(/*language=SQL*/ `
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
    apply.id = apply.resource_id;

    apply = util.namifyRecord(apply, ctx.lookup);

    ctx.body = apply;
}

module.exports = {
    get: getHandler,
    patch: patchHandler
};
