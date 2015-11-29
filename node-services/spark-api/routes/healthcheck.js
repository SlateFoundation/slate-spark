'use strict';

function *getHandler() {
    this.body = { ok: true };
}

module.exports = {
    get: getHandler
};
