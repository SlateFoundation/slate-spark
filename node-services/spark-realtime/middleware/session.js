'use strict';

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

        if (options.requireSession) {
            if (session === undefined) {
                return next(new Error(`Session header (${sessionHeaderName}) is missing from the request.`));
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

            let accountLevel = session.accountLevel.toLowerCase();

            if (app && acountLevel !== 'developer' && app !== accountLevel) {

                return next(
                    new Error(`${accountLevel} users should use the ${accountLevel} app; you're using the ${app} app.`)
                );

                socket.disconnect(true);
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

        socket.join('user:' + session.userId);

        // TODO: Remove this once the session id is sent by all load balancers
        if (session.id) {
            socket.join('session:' + session.id);
        }

        return next();
    };
}

module.exports = ioSession;