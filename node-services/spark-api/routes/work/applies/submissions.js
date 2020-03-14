var util = require('../../../lib/util');

function *postHandler() {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        id = parseInt(ctx.query.id, 10),
        submission = ctx.request.body;

    ctx.require(['sparkpoint_id', 'id']);

    console.log(submission);
    console.log(typeof submission);

    ctx.assert(util.isGtZero(id), 400, `id must be an integer, you passed: ${ctx.query.id}`);
    ctx.assert(typeof submission === 'object', 400, `the request body should a single JSON encoded submission`);
    ctx.assert(util.isString(submission.url), 400, `url must be a string, you passed: ${submission.url}`);

    // TODO: submissions are a candidate for time sortable UUIDs
    delete submission.id;

    ctx.body = yield ctx.pgp.one(`
            INSERT INTO applies (sparkpoint_id, student_id, resource_id, submissions)
                         VALUES ($1, $2, $3, jsonb_build_array($4::JSONB)) ON CONFLICT (resource_id, student_id, sparkpoint_id) DO UPDATE SET
                                submissions = jsonb_array_push_unique($4::JSONB, applies.submissions)
                      RETURNING *;`,
        [sparkpointId, ctx.studentId, id, submission]
    );
}

function *deleteHandler() {
    var ctx = this,
        sparkpointId, id, submission, url;

    ctx.require(['sparkpoint_id', 'id', 'url']);

    sparkpointId = ctx.query.sparkpoint_id;
    id = parseInt(ctx.query.id, 10);
    url = ctx.query.url;

    ctx.assert(util.isGtZero(id), 400, `id must be an integer, you passed: ${ctx.query.id}`);
    ctx.assert(util.isString(url), 400, `url must be a string, you passed: ${url}`);

    submission = {
        url: url,
        id: id
    };

    ctx.body = yield this.pgp.one(/*language=SQL*/ `
            UPDATE applies
               SET submissions = jsonb_remove_array_element($4::JSONB, submissions)
             WHERE sparkpoint_id = $1
               AND student_id = $2
               AND fb_apply_id = $3
         RETURNING *;`,
        [sparkpointId, this.studentId, id, submission]
    );
}

module.exports = {
    delete: deleteHandler,
    post: postHandler
};
