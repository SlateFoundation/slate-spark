'use strict';

module.exports = function* (next) {
    var ctx = this;

    yield next;

    // For developers: send x-nginx-* request headers in the response for debugging purposes (also see: /test)
    if (ctx.isDeveloper) {
        for (var header in ctx.headers) {
            if (header.startsWith('x-nginx-')) {
                ctx.set(header, ctx.headers[header]);
            }
        }
    }
};