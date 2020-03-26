async function patchHandler(ctx, next) {
    var ids = [],
        completes = [],
        todos = [],
        query = [],
        body = ctx.request.body;

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

    ctx.body = await ctx.pgp.any(query.join('\n'));
}

async function getHandler(ctx, next) {
    var query = 'SELECT * FROM todos WHERE user_id = $1',
        vals = [ctx.studentId],
        completed = ctx.query.completed ? ctx.query.completed.toString() : null;

    if (completed) {
        completed = completed === 'true';
        query += ' AND completed = $2';
        vals.push(completed);
    }

    ctx.body = await ctx.pgp.manyOrNone(query, vals);
}

module.exports = {
    patch: patchHandler,
    get: getHandler
};
