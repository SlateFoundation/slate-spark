'use strict';

module.exports = async function responseTimeMiddleware(ctx, next) {
    var start = new Date,
        ms;

    await next();

    ms = new Date - start;

    ctx.set('X-Response-Time', ms + 'ms');
};
