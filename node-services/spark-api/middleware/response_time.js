'use strict';

module.exports = function *responseTime(next) {
    var ctx = this,
        start = new Date,
        ms;

    yield next;

    ms = new Date - start;

    ctx.set('X-Response-Time', ms + 'ms');
};
