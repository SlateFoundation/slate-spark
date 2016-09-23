'use strict';

function *getHandler() {
    ctx.body = 'Not implemented';
}

module.exports = {
  get: getHandler
};