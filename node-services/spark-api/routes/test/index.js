'use strict';

async function getHandler(ctx, next) {
    ctx.body = {
        session: ctx.session,
        headers: ctx.headers,
        query: ctx.query,
        body: ctx.body,
        guc: await ctx.pgp.any(`
            SELECT current_setting('spark.user_id') AS user_id,
                   current_setting('spark.request_id') AS request_id,
                   current_setting('spark.role') AS role,
                   current_setting('application_name') AS application_name
        `)
    };

    if (ctx.isDeveloper) {
        ctx.body['*********************** BEGIN CONFIDENTIAL DATA ***********************'] = true;
        ctx.body.state = ctx.state;
        ctx.body['***********************  END CONFIDENTIAL DATA  ***********************'] = true;
        ctx.body.introspection = ctx.introspection;
    }
}

module.exports = {
    get: getHandler
};
