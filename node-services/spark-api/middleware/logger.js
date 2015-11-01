'use strict';

const uuid = require('node-uuid');

module.exports = function *logger(next) {
    var start = new Date;
    this.set('X-Request-Id', uuid.v1());

    yield next;

    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms, 'ms');
};
