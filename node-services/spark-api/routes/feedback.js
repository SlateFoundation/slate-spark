'use strict';

var AsnStandard = require('../lib/asn-standard'),
    lookup = require('../lib/lookup');

function *getHandler() {
    this.throw('error from get handler', 500);
}

function *patchHandler() {
    this.throw('error from patch handler', 500);
}

function *deleteHandler() {
    this.throw('error from delete handler', 500);
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
    delete: deleteHandler
};
