'use strict';

var cachedLookups = null;

function* getHandler() {
    var ctx = this;

    if (!cachedLookups) {
        cachedLookups = {};
        for (var entity in ctx.lookup) {
            cachedLookups[entity] = ctx.lookup[entity].cache;
        }
    }

    ctx.body = cachedLookups;
}

module.exports = {
  get: getHandler
};

