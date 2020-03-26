'use strict';

module.exports = async function aclMiddleware (ctx, next) {
    if (!ctx.userId) {
        // ctx.throw('Authentication required', 403);
        ctx.userId = 1;
    }

    await next();
};
