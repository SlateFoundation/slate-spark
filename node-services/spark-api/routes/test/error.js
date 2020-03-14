'use strict';

function *getHandler(code) {
    var ctx = this;

    return ctx.throw(parseInt(code, 10), new Error('Test error'));
}

module.exports = {
    get: getHandler
};
