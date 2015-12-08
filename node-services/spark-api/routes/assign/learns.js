'use strict';

var util = require('../../lib/util');

function *getHandler() {
    this.throw(new Error('getHandler not implemented'), 501);
}

function *patchHandler() {
    this.throw(new Error('patchHandler not implemented'), 501);

}

module.exports = {
    get: getHandler,
    patch: patchHandler
};
