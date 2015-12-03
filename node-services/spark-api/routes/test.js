'use strict';

function *getHandler() {
    this.body = {
        session: this.session,
        headers: this.headers,
        query: this.query,
        body: this.body,
        guc: yield this.pgp.one(this.guc(`
            SELECT current_setting('spark.user_id') AS user_id,
                   current_setting('spark.request_id') AS request_id,
                   current_setting('spark.role') AS role,
                   current_setting('application_name') AS application_name
        `))
    };
}

module.exports = {
    get: getHandler
};