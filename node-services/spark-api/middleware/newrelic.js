'use strict';

module.exports = function (newrelic) {
    return async function newrelicMiddleware (ctx, next) {
        newrelic.setControllerName(ctx.url.split(/[?#]/)[0], ctx.method);
        await next();
    };
};
