'use strict';

module.exports = function* (next) {
    var ctx = this;
    
    if (!ctx.userId) {
        ctx.throw('Authentication required', 403);
    }

    yield next;
}