'use strict';

module.exports = function *logger(next) {
    var start = new Date;

    yield next;

    var ms = new Date - start;

    if (process.env.NODE_ENV === 'production') {
        console.log('[%s] - %s %s - %s - %s', start.toUTCString(), this.method, this.url, ms, 'ms', this.requestId);
    } else {
        console.log('[%s] - %s %s - %s - %s', start.toUTCString(), this.method, this.url, ms, 'ms');
        if (this.request.body) {
            console.log(this.request.body);
        }
    }

    if (this.requestId) {
        this.set('X-Request-Id', this.requestId);
    }
};
