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
       if (!isNaN(todo.id) && typeof todo.complete === 'boolean') {
           query.push('UPDATE todos SET complete = ' + todo.complete + ' WHERE id = ' + todo.id + ' AND user_id = ' + req.session.userId + ';');
       }
    });

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