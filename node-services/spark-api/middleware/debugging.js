'use strict';

module.exports = async function debuggingMiddleware(ctx, next) {
    await next();

    // For developers: send x-nginx-* request headers in the response for debugging purposes (also see: /test)
    if (ctx.isDeveloper) {
        for (var header in ctx.headers) {
            if (header.startsWith('x-nginx-')) {
                ctx.set(header, ctx.headers[header]);
            }
        }
    }
};
