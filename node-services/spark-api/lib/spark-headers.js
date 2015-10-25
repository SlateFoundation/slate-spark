'use strict';

var errors = require('restify-errors');

function sparkHeaderParser(options) {
    function parseSparkHeaders(req, res, next) {
        var session;

        if (req.headers['x-nginx-session']) {
            try {
                session = JSON.parse(req.headers['x-nginx-session']);
            } catch (e) {
                next(new errors.InvalidContentError('Invalid JSON in x-nginx-session: ' +
                    e.message));
                return;
            }

            req.session = session;
        }

        return next();
    }

    return (parseSparkHeaders);
}

module.exports = sparkHeaderParser;