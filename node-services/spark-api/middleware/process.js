'use strict';

module.exports = function *(next) {
    var ctx = this;

    ctx.set('X-Spark-Dev-Process-PID', process.pid);

    yield next;
};
