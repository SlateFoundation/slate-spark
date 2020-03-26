'use strict';

const util = require('../../lib/util');

// HTTP 200: Get discussion(s)
async function getHandler(ctx, next) {

    ctx.body = (await ctx.pgp.one(/*language=SQL*/
        `SELECT (CASE
                     WHEN EXISTS (SELECT 1 FROM learn_resources WHERE id = $1)
                     THEN (SELECT coalesce(json_agg(learn_discussions), '[]'::JSON) FROM learn_discussions WHERE resource_id = $1)
                     ELSE
                     json_build_object('error', 'could not find resource_id: ' || $1)
                  END
                 ) AS json`, [ctx.params.resourceId])).json;

    if (ctx.body.error) {
        ctx.status = 404;
    }
}

// HTTP 200: Update an existing discussion
async function patchHandler(ctx, next) {
    var discussion = ctx.request.body,
        updatedRecord;

    ctx.assert(typeof discussion.id === 'number', 'id is required');
    ctx.assert(typeof discussion.body === 'string', 'body is required');
    ctx.assert(discussion.body.length > 0, 'body cannot be empty/zero length');

    if (discussion.body.author_id !== undefined && discussion.body.author_id !== ctx.userId) {
        console.warn(`TAMPERING EVIDENT: ${ctx.userId} passed a different author_id: ${discussion.body.author_id}`);
    }

    updatedRecord = await ctx.pgp.oneOrNone(/*language=SQL*/ `
        UPDATE learn_discussions
           SET body = $1
         WHERE id = $2
           AND author_id = $3
     RETURNING *
    `, [discussion.body, discussion.id, ctx.userId]);

    ctx.assert(updatedRecord, 'Learn discussion not found', 404);

    ctx.body = updatedRecord;
}

// HTTP 201: Delete an existing discussion
async function deleteHandler(ctx, next) {
    ctx.throw('Not implemented', 501);
}

// HTTP 204: Create a new discussion
async function postHandler(ctx, next) {
    var body = ctx.request.body,
        recordToInsert = util.recordToInsert.bind(ctx),
        vals = new util.Values(),
        record;

    if (ctx.params.resourceId) {
        body.resource_id = parseInt(ctx.params.resourceId, 10);
    }

    ctx.assert(typeof body.body === 'string', 'body is required');
    ctx.assert(typeof body.resource_id === 'number', 'resource_id is required');

    if (body.author_id !== undefined && body.author_id !== ctx.userId) {
        console.warn(`TAMPERING EVIDENT: ${ctx.userId} passed a different author_id: ${body.author_id}`);
    }

    record = {
        body: body.body,
        sparkpoint_id: ctx.query.sparkpoint_id,
        section_id: ctx.query.section_id,
        resource_id: ctx.params.resourceId,
        author_id: ctx.userId
    };

    ctx.body = await ctx.pgp.one(recordToInsert('learn_discussions', record, vals) + ' RETURNING * ', vals.vals);
}

module.exports = {
    get: getHandler,
    post: postHandler,
    patch: patchHandler,
    delete: deleteHandler,
    autoRoute: false
};
