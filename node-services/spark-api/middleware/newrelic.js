'use strict';

module.exports = function (newrelic) {
    return function *(next) {
        newrelic.setControllerName(this.url.split(/[?#]/)[0], this.method);
        yield next;
    };
};
