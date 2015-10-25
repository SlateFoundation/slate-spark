'use strict';

var uuid = require('node-uuid');

class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor.name)
    }
}

function extractFileLocation(str) {
    var matches = str.toString().match(/\((\/.*\.js:\d+:\d+)\)/gm);

    if (matches.length >= 3) {
        return matches[2];
    }

    return null;
}

class ErrorList {
    constructor(errors) {
        if (!errors instanceof Set) {
            if (Array.isArray(errors)) {
                
            }
        }
        this.errors = errors || [];
    }

    add (error) {
        this.errors.push(error);
    }

    remove(error) {
        this.errors.remove(error);
    }
}

class JsonApiError extends ExtendableError {
    constructor(m) {
        super(m);

        this.id = uuid.v1();

        this.meta = {
            stack: extractFileLocation(this.stack)
        };

        this.links = {
            about: 'http://jsonapi.org/format/#error-objects'
        };
    }
}

JsonApiError.prototype.toJSON = function() {
    return {
        id: this.id,
        code: this.name,
        title: this.message,
        links: this.links,
        meta: this.meta,
        source: this.source,
        detail: this.detail
    };
};

JsonApiError.prototype.toString = JsonApiError.prototype.toJSON;

module.exports = {
    JsonApiError: JsonApiError,
    ExtendableError: ExtendableError
};