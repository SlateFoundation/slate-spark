'use strict';

const PRODUCTION = process.env.NODE_ENV === 'production';

function ioSession(options) {

    // TODO: refactor this, sessionHeaderName doesn't seem to be set correctly
    options = Object.assign({}, {
        sessionHeaderName: 'x-nginx-session',
        requiredKeys: null,
        validationFn: null,
        requireSession: true,
        defaultSession: null
    }, options);
    
    if (options.validationFn !== null && typeof options.validationFn !== 'function') {
        throw new Error('validationFn must be a function');
    }

    if (options.requiredKeys !== null && !Array.isArray(options.requiredKeys)) {
        throw new Error('requiredKeys must be an array or null');
    }

    if (!options.requireSession && options.requiredKeys !== null) {
        throw new Error('You cannot provide requiredKeys if requireSession is false');
    }

    return function handleSession(socket, next) {
        var sessionHeaderName = options.sessionHeaderName,
            requiredKeys = options.requiredKeys,
            session = socket.request.headers[sessionHeaderName],
            referer = socket.request.headers.referer,
            app = referer.match(/\/spark\/classroom\/(student|teacher)/i);

        app ? app[1] : 'unknown';

        // For developers working locally
        if (app) {
            app = app[1];
        } else if (referer.indexOf('SparkClassroomStudent') !== -1) {
            app = 'student';
        } else if (referer.indexOf('SparkClassroomTeacher') !== -1) {
            app = 'student';
        }

        if (options.requireSession) {
            if (session === undefined) {
                let cookies = socket.request.headers.cookie;

                if (!PRODUCTION && cookies.indexOf('spoof_headers=') !== -1) {
                    // HACK: Use a cookie parser
                    try {
                        session = JSON.parse(cookies.split('spoof_headers=')[1])[options.sessionHeaderName];
                    } catch (e) {
                        return next(e);
                    }
                } else {
                    return next(new Error(`You must be logged in to use Spark.`));
                }
            }

            try {
                session = JSON.parse(session);
            } catch (e) {
                return next(e);
            }

            // Verify that all required keys are present
            if (requiredKeys) {
                let missingKeys = requiredKeys.filter(key => session[key] === undefined);

                if (missingKeys.length > 0) {
                    return next(new Error(`Session is missing required key(s): ${missingKeys.join(', ')}`));
                }
            }
        }

        // Perform custom validation
        if (options.validationFn) {
            let error = options.validationFn(session, socket, next);

            if (error) {
                return next(error);
            }
        }

        socket.session = session || options.defaultSession;

        socket.isStudent = socket.session.accountLevel === 'Student';
        socket.isTeacher = !socket.isStudent;

        console.log(session);
        console.log(socket.request.headers);
        console.log(socket.request.remoteAddress);

        socket.join('user:' + session.userId);

        // TODO: Remove this once the session id is sent by all load balancers
        if (session.id) {
            socket.join('session:' + session.id);
        }

        return next();
    };
}

module.exports = ioSession;