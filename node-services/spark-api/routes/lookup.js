'use strict';

var cachedLookups = null;

async function getHandler(ctx, next) {
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

