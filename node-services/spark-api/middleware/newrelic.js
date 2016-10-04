'use strict';

module.exports = function (newrelic) {
    return function *(next) {
        var ctx = this;

        newrelic.setControllerName(ctx.url.split(/[?#]/)[0], ctx.method);
        
        yield next;
    };
};
