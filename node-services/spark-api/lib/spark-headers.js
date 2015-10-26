'use strict';

var errors = require('restify-errors');

function sparkHeaderParser(options) {
    function parseSparkHeaders(req, res, next) {
        var session;

        if (req.headers['x-nginx-session']) {
            try {
                session = JSON.parse(req.headers['x-nginx-session']);
            } catch (e) {
                return next(new errors.InvalidContentError('Invalid JSON in x-nginx-session: ' +
                    e.message));
            }

            req.session = session;
            req.schema = req.headers['x-nginx-mysql-schema'];
            req.dbHost = req.headers['x-nginx-mysql-host'];

            req.isStudent = req.session.accountLevel === 'Student';
            req.isTeacher = req.session.accountLevel === 'Teacher';
            req.isDeveloper = req.session.accountLevel === 'Developer';

            req.studentId = req.isStudent ? req.session.userId : req.params.student_id;
        }

        if (!req.session) {
            return next(new errors.HttpError('403'));
        }

        return next();
    }

    return (parseSparkHeaders);
}

module.exports = sparkHeaderParser;