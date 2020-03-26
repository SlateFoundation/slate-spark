'use strict';

async function getHandler(ctx, next) {
    ctx.body = { ok: true };
}

module.exports = {
    get: getHandler
};
