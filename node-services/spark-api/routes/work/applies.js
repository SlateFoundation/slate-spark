var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    util = require('../../lib/util');

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
               (SELECT json_agg(json_build_object('id', id, 'todo', todo, 'completed', completed)) FROM todos WHERE user_id = $2 AND apply_id = ap.id) AS my_todos,
               (SELECT json_agg(row_to_json(reviews)) FROM (SELECT * FROM apply_reviews WHERE student_id = $2 AND apply_id = ap.id) AS reviews) AS apply_reviews,
               (SELECT json_agg(row_to_json(reviews)) FROM (SELECT * FROM learn_reviews WHERE student_id = $2 AND resource_id = ANY (SELECT id FROM learn_resources WHERE sparkpoint_id = $3))AS reviews) AS learn_reviews
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
            apply_reviews: apply.apply_reviews || [],
            learn_reviews: apply.learn_reviews || []
        };
    });
}

function *patchHandler() {
    this.require(['sparkpoint_id', 'student_id', 'id']);

    var sparkpointId = this.query.sparkpoint_id,
        studentId = this.studentId,
        selected = this.query.selected,
        id = parseInt(this.query.id, 10),
        constraintKeys = ['student_id', 'fb_apply_id', 'sparkpoint_id'],
        updateSets = [],
        values = [],
        apply,
        body = this.request.body,
        exists,
        todoValues,
        todoPlaceholders,
        todosPopulated,
        todos;

    if (isNaN(id)) {
        this.throw('id must be an integer, you passed: ' + this.query.id, 400);
    }

    apply = {
        fb_apply_id: id,
        student_id: studentId,
        sparkpoint_id: sparkpointId
    };

    if (typeof selected === 'boolean') {
        apply.selected = selected;
    }

    if (typeof body.reflection === 'string') {
        apply.reflection = body.reflection;
    }

    if (Array.isArray(body.submissions)) {
        apply.submissions = JSON.stringify(body.submissions);
    }

    Object.keys(apply).forEach(function(key, i) {
       values.push(apply[key]);

       if (constraintKeys.indexOf(key) !== -1) {
           return;
       }

        updateSets.push(`${key} = $${++i}`);
    });

    exists = yield this.pgp.oneOrNone(
        'SELECT 1 FROM applies WHERE student_id = $1 AND fb_apply_id = $2 AND sparkpoint_id = $3',
        [studentId, id, sparkpointId]);

    todosPopulated = yield this.pgp.oneOrNone(`
        SELECT 1
          FROM todos
         WHERE todos.apply_id = $1
           AND todos.user_id = $2
         LIMIT 1;
     `, [studentId, id]);

    if (!todosPopulated) {
        todos = yield this.pgp.one('SELECT todos FROM spark1.s2_apply_projects WHERE id = $1', [id]);

        todoValues = [studentId, id];

        todos = todos.todos;

        todoPlaceholders = todos.map(function (todo, i) {
            todoValues.push(todo);
            return `($1, $2, $${i + 3})`;
        });

        todos = yield this.pgp.manyOrNone(`
            INSERT INTO todos (user_id, apply_id, todo)
                              VALUES ${todoPlaceholders.join(',\n')}
                              ON CONFLICT (user_id, apply_id, md5(todo)) DO NOTHING
            RETURNING *;`, todoValues);
    }

    if (todos.length === 0) {
        todos = yield this.pgp.any('SELECT id, todo, completed FROM todos WHERE user_id = $1 AND apply_id = $2', [studentId, id]);
    }

    if (updateSets.length === 0 && exists) {
        return this.throw('You cannot perform a no-op query.', 400);
    }

    apply = yield this.pgp.one(`
        INSERT INTO applies
                    (${Object.keys(apply)})
             VALUES (${Object.keys(apply).map(function (x, i) {
        return '$' + (i + 1);
    })})
        ON CONFLICT (student_id, fb_apply_id, sparkpoint_id) DO UPDATE SET ${updateSets.join(",\n")}
             RETURNING *
    `, values);

    yield this.pgp.none(
        'UPDATE applies SET selected = false WHERE selected = true AND fb_apply_id != $1 AND sparkpoint_id = $2 AND student_id = $3;',
        [id, sparkpointId, studentId]
    );

    apply.todos = todos;
    apply.id = apply.fb_apply_id;

    this.body = apply;
}

function *submissionsPostHandler() {
    this.require(['sparkpoint_id', 'id']);

    var sparkpointId = this.query.sparkpoint_id,
        userId = this.studentId,
        id = parseInt(this.query.id, 10),
        apply,
        submission = this.request.body;

    if (isNaN(id)) {
        return this.throw('id must be an integer, you passed: ' + this.query.id, 400);
    }

    apply = yield this.pgp.oneOrNone(
        'SELECT * FROM applies WHERE student_id = $1 AND sparkpoint_id = $2 AND fb_apply_id = $3',
        [userId, sparkpointId, id]
    );

    if (apply) {
        delete submission.id;
        apply.submissions.push(submission);
        this.request.body = apply;
        yield util.bind(patchHandler, this);
    } else {
        this.throw('Unable to find apply id: ' + this.query.id, 404);
    }
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    submissions: {
        post: submissionsPostHandler
    }
};
