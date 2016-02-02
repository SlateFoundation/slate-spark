'use strict';

module.exports = function *logger(next) {
    var start = new Date;

    yield next;

    var ms = new Date - start;

    if (process.env.NODE_ENV === 'production') {
        console.log('[%s] - %s %s - %s - %s', start.toUTCString(), this.method, this.url, ms, 'ms', this.requestId);
        console.log(this.request.body);
    } else {
        console.log('[%s] - %s %s - %s - %s', start.toUTCString(), this.method, this.url, ms, 'ms');
        console.log(this.request.body);
    }
};
