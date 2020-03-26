'use strict';

const request = require('koa-request');
const PRODUCTION = process.env.NODE_ENV === 'production';

var subdomainBySchema = {
    'sandbox-school': 'sandbox-school',
    'mta-live' : 'spark.mta',
    'merit-live' : 'spark.merit',
    'mta-staging': 'staging.spark.mta',
    'merit-staging': 'staging.spark.merit'
};

const uuid = require('node-uuid');

async function getHandler(ctx, next) {
    if (PRODUCTION) {
        ctx.throw(new Error('Development is not supported in PRODUCTION mode... yet'), 500);
    }

    let {schema, user, username} = ctx.request.query;

    user || (user = username);

    if (user && schema) {
        if (!ctx.pgpConnections || !ctx.pgpConnections[schema] || !schema) {
            ctx.throw(new Error(`Could not find ${schema} schema, try one of these: ${Object.keys(ctx.pgpConnections || {})}`), 404);
        }

        ctx.cookies.set('user', user);
        ctx.cookies.set('schema', schema);

        ctx.pgp = ctx.pgpConnections[schema];

        let session = await ctx.pgp.one(`
        SELECT
            p."FirstName" AS "firstName",
            p."LastName" AS "lastName",
            p."ID" AS "userId",
            (SELECT "Data" FROM contact_points cp WHERE cp."ID" = p."PrimaryEmailID") AS email,
            "AccountLevel" AS "accountLevel",
            (SELECT array_agg(g."Handle") FROM group_members gm JOIN groups g ON g."ID" = gm."GroupID" WHERE gm."PersonID" = p."ID") AS "groupHandles",
            "Username" AS username
       FROM people p
        WHERE "Username" = $1 LIMIT 1
        `, [user]);

        let sessionId = uuid.v1();

        await ctx.pgp.none(`
            INSERT INTO fdw_sessions ("Class", "Handle", "PersonID") VALUES ('UserSession', $1, $2);
        `, [sessionId, session.userId]);


        ctx.cookies.set('spoof_headers', JSON.stringify({
            'x-nginx-session': JSON.stringify(session),
            'x-nginx-mysql-schema': schema,
            'x-nginx-session-id': sessionId
        }));

        ctx.cookies.set('session_id', sessionId);

        ctx.body = `Your effective API user for ${ctx.request.hostname}.matchbooklearning.com is: ${user} on ${schema} (${subdomainBySchema[schema]}.matchbooklearning.com)`;
    }
}

module.exports = {
    get: getHandler
};
