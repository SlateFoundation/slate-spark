'use strict';

function *getHandler() {
    var ctx = this;

    ctx.body = {
        session: ctx.session,
        headers: ctx.headers,
        query: ctx.query,
        body: ctx.body,
        guc: yield ctx.pgp.any(`
            SELECT current_setting('spark.user_id') AS user_id,
                   current_setting('spark.request_id') AS request_id,
                   current_setting('spark.role') AS role,
                   current_setting('application_name') AS application_name
        `),
        intospection: ctx.introspection,
        state: ctx.state
    };
}

module.exports = {
    get: getHandler
};
