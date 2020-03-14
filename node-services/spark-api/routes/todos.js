function* patchHandler() {
    var ids = [],
        completes = [],
        todos = [],
        query = [],
        body = this.request.body,
        ctx = this;

    if (!Array.isArray(body)) {
        return this.throw('Request body should be an array of todos', 400);
    }

    body.forEach(function(todo) {
       if (!isNaN(todo.id) && typeof todo.completed === 'boolean') {
           query.push(
               `UPDATE todos SET completed = ${todo.completed} WHERE id = ${todo.id} AND user_id = ${ctx.studentId} RETURNING *;`
           );
       } else {
           ctx.throw('Todo records should contain a boolean completed and an integer id', 400);
       }
    });

    if (query.length === 0) {
        return this.throw('Request body should be an array of one or more todos', 400);
    }

    this.body = yield this.pgp.any(query.join('\n'));
}

function* getHandler() {
    var query = 'SELECT * FROM todos WHERE user_id = $1',
        vals = [this.studentId],
        completed = this.query.completed ? this.query.completed.toString() : null;

    if (completed) {
        completed = completed === 'true';
        query += ' AND completed = $2';
        vals.push(completed);
    }

    this.body = yield this.pgp.manyOrNone(query, vals);
}

module.exports = {
    patch: patchHandler,
    get: getHandler
};