'use strict';

function ioSession(options) {
    options = Object.assign({
        sessionHeaderName: 'session',
        requiredKeys: null,
        validationFn: null,
        requireSession: true,
        defaultSession: null
    }, options || {});

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
            session = socket.request.headers[sessionHeaderName];

        if (options.requireSession) {
            if (session === undefined) {
                return next(new Error(`Session header (${sessionHeaderName}) is missing from the request.`));
            }

            try {
                session = JSON.parse(session);
                console.log(session);
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

        socket.isStudent = socket.accountLevel === 'Student';
        socket.isTeacher = !socket.isStudent;

        next();
    };
}

module.exports = ioSession;