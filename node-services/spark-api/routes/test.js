'use strict';

function *getHandler() {
    this.body = {
        session: this.session,
        headers: this.headers,
        query: this.query,
        body: this.body
    };
}

module.exports = {
    get: getHandler
};