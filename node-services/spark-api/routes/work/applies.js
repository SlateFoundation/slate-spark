var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util');

function getHandler(req, res, next) {
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        standardIds = [];

    if (sparkpointIds.length === 0) {
        res.json(new JsonApiError('sparkpoint or sparkpoints parameter is required.'));
        return next();
    }

    sparkpointIds.forEach(function (sparkpointId) {
        (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
            standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
        });
    });

    if (standardIds.length === 0) {
        res.statusCode = 404;
        res.json(new JsonApiError('Invalid sparkpoint' + (sparkpointIds.length ? 's' : '')));
        return next();
    }

    if (!req.studentId) {
        res.statusCode = 400;
        res.json({error: 'userid required'});
        return next();
    }

    db(req).manyOrNone(`
        SELECT *,
               (SELECT selected FROM applies a WHERE a.fb_apply_id = ap.id AND student_id = $2 AND sparkpoint_id = ANY($3) LIMIT 1) AS selected,
               (SELECT reflection FROM applies a WHERE a.fb_apply_id = ap.id AND student_id = $2 AND sparkpoint_id = ANY($3) LIMIT 1) AS reflection,
               (SELECT submissions FROM applies a WHERE a.fb_apply_id = ap.id AND student_id = $2 AND sparkpoint_id = ANY($3) LIMIT 1) AS submissions,
               (SELECT json_agg(json_build_object('id', id, 'todo', todo, 'completed', completed)) FROM todos WHERE user_id = $2 AND apply_id = ap.id) AS my_todos
          FROM spark1.s2_apply_projects ap
         WHERE standardids::JSONB ?| $1`, [standardIds, req.studentId, sparkpointIds]).then(function (result) {

        res.json(result.map(function (apply) {
            return {
                id: apply.id,
                title: apply.title,
                instructions: apply.instructions,
                gradeLevel: apply.gradeLevel,
                dok: apply.dok,
                sparkpointIds: util.toSparkpointIds(apply.standardids),
                sparkpointCodes: util.toSparkpointCodes(apply.standardids),
                standardCodes: util.toStandardCodes(apply.standardids),
                todos: apply.my_todos || (apply.todos || []).map(function(todo) { return { todo: todo }; }),
                links: (apply.links || []).filter(link => link !== '\n').map(link => link.toString().trim()),
                timeEstimate: apply.timestimate,
                metadata: apply.metadata === '""' ? {} : apply.metadata,
                selected: apply.selected || false,
                reflection: apply.reflection,
                submissions: apply.submissions || []
            };
        }));
        return next();
    }, function (err) {
        res.json(new JsonApiError(err));
        return next();
    });
}

function patchHandler(req, res, next, todos) {
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        sparkpointId = sparkpointIds[0],
        userId = req.studentId,
        isTeacher = req.isTeacher,
        selected = (req.params.selected === 'true') ? true : (req.params.selected === 'false') ? false : (typeof req.body.selected === 'boolean') ? req.body.selected : null;
        id = parseInt(req.params.id, 10),
        apply = {},
        constraintKeys = ['student_id', 'fb_apply_id', 'sparkpoint_id'],
        updateSets = [],
        values = [];

    if (isNaN(id)) {
        res.statusCode = 400;
        res.json({error: 'id must be an integer, you passed: ' + req.params.id, params: req.params, body: req.body});
        return next();
    }

    if (!sparkpointId) {
        res.statusCode = 400;
        res.json({error: 'sparkpoint id is required', params: req.params, body: req.body});
        return next();
    }

    apply.fb_apply_id = id;

    if (typeof selected === 'boolean') {
        apply.selected = selected;
    }

    apply.student_id = userId;
    apply.sparkpoint_id = sparkpointId;

    if (typeof req.body.reflection === 'string') {
        apply.reflection = req.body.reflection;
    }

    if (Array.isArray(req.body.submissions)) {
        apply.submissions = JSON.stringify(req.body.submissions);
    }

    Object.keys(apply).forEach(function(key, i) {
       values.push(apply[key]);

       if (constraintKeys.indexOf(key) !== -1) {
           return;
       }

        updateSets.push(`${key} = $${++i}`);
    });

    db(req).oneOrNone('SELECT 1 FROM applies WHERE student_id = $1 AND fb_apply_id = $2 AND sparkpoint_id = $3', [ userId, id, sparkpointId ]).then(function(exists) {
        if (!exists && !todos) {
            db(req).one('SELECT todos FROM spark1.s2_apply_projects WHERE id = $1', [id]).then(function(todos) {
                var values = [ userId, id ],
                    todoValues;

                todos = todos.todos;

                todoValues = todos.map(function(todo, i) {
                    values.push(todo);
                    return `($1, $2, $${i+3})`;
                });

                db(req).any(`INSERT INTO todos (user_id, apply_id, todo) VALUES ${todoValues.join(',\n')} RETURNING *;`, values).then(function(todos) {
                    return patchHandler(req, res, next, todos);
                }, function(error) {
                    res.statusCode = 500;
                    res.json({error: error});
                    return next();
                });

            }, function(error) {
                res.statusCode = 500;
                res.json({error: error});
                return next();
            });
        } else {
            if (updateSets.length === 0) {
                res.statusCode = 400;
                res.json({error: 'you cannot perform a no-op query, here is what you gave us', body: req.body, params: req.params });
                return next();
            }
            db(req).one(`
                INSERT INTO applies
                            (${Object.keys(apply)})
                     VALUES (${Object.keys(apply).map(function(x, i) { return '$' + (i + 1); })}) ON CONFLICT (student_id, fb_apply_id, sparkpoint_id) DO UPDATE SET ${updateSets.join(",\n")}
                     RETURNING *
            `, values).then(function(apply) {
                    db(req).any('SELECT id, todo, completed FROM todos WHERE user_id = $1 AND apply_id = $2', [ userId, id ]).then(function(todos) {
                        db(req).none('UPDATE applies SET selected = false WHERE fb_apply_id != $1 AND sparkpoint_id = $2 and student_id = $3;', [id, sparkpointId, userId]);
                        apply.todos = todos;
                        apply.id = apply.fb_apply_id;
                        res.json(apply);
                        return next();
                    }, function(error) {
                        res.statusCode = 500;
                        res.json({error: error});
                        return next();
                    });
                }, function(error) {
                    res.statusCode = 500;
                    res.json({error: error});
                    return next();
                });
        }
    }, function(error) {
        res.statusCode = 500;
        res.json({error: error});
        return next();
    });
}

function submissionsPostHandler(req, res, next) {
    var sparkpointIds = util.toSparkpointIds(req.params.sparkpoint || req.params.sparkpoints),
        sparkpointId = sparkpointIds[0],
        userId = req.studentId,
        isTeacher = req.isTeacher,
        id = parseInt(req.params.id, 10),
        sql,
        applyProject;

    if (isNaN(id)) {
        res.statusCode = 400;
        res.json({error: 'id must be an integer, you passed: ' + req.params.id, params: req.params, body: req.body});
        return next();
    }

    if (!sparkpointId) {
        res.statusCode = 400;
        res.json({error: 'sparkpoint id is required', params: req.params, body: req.body});
        return next();
    }

    db(req).oneOrNone('SELECT * FROM applies WHERE student_id = $1 AND sparkpoint_id = $2 AND fb_apply_id = $3',
        [userId, sparkpointId, id]).then(function(apply) {
            var submission = req.body;
            if (apply) {
                delete submission.id;
                apply.submissions.push(submission);
                req.body = apply;
                return patchHandler(req, res, next);
            } else {
                res.statusCode = 404;
                res.json({ error: 'Unable to find apply.', params: req.params, body: req.body });
                return next();
            }
    }, function(error) {
        res.statusCode = 500;
        res.json({error: error,  params: req.params, body: req.body });
        return next();
    });
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    submissions: {
        post: submissionsPostHandler
    }
};
