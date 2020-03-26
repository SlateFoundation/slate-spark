'use strict';

module.exports = async function processMiddleware(ctx, next) {
    ctx.set('X-Spark-Dev-Process-PID', process.pid);
    await next();
};
