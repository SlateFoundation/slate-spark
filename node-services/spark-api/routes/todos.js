var db = require('../lib/database');

function patchHandler(req, res, next) {
    var ids = [],
        completes = [],
        todos = [],
        query = [];

    if (!Array.isArray(req.body)) {
        res.json({error: 'request body should be an array', body: req.body });
        return next();
    }

    req.body.forEach(function(todo) {
       if (!isNaN(todo.id) && typeof todo.completed === 'boolean') {
           query.push('UPDATE todos SET completed = ' + todo.completed + ' WHERE id = ' + todo.id + ' AND user_id = ' + req.session.userId + ';');
       } else {
           res.statusCode = 400;
           res.json({ error: 'records should contain a boolean completed and an integer id', input: todo });
           return next();
       }
    });

    if (query.length === 0) {
        res.statusCode = 400;
        res.json({error: 'you must pass at least one item', body: req.body, params: req.params});
        return next();
    }

    db(req).any(query.join('\n')).then(function() {
        res.json(req.body);
        return next();
    }, function(error) {
        res.statusCode = 500;
        res.json({error: error, query: query.join('\n')});
        return next();
    });
}

module.exports = {
    patch: patchHandler
};