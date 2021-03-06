'use strict';

/*******************************************************************************
 * IMPORTANT: The session middleware MUST be run BEFORE the request middleware *
 *******************************************************************************/

module.exports = function *session(next) {
    var ctx = this,
        headers = ctx.headers,
        session;

    if (headers['x-nginx-session']) {
        try {
            session = JSON.parse(headers['x-nginx-session']);
        } catch (e) {
            ctx.throw(new Error('Invalid JSON in x-nginx-session: ' + e.message), 400);
        }

        ctx.firstName = session.firstName;
        ctx.lastName = session.lastName;

        ctx.role = session.accountLevel.toLowerCase();
        ctx.username = session.username;
        ctx.session = session;
        ctx.schema = ctx.header['x-nginx-mysql-schema'] || 'sandbox-school';

        // TODO: isRole is an anti-pattern, hasRole is better (a developer is NOT a teacher; but has the rights of one)
        ctx.isDisabled = ctx.role === 'disabled';
        ctx.isAdmin = ctx.role === 'administrator';
        ctx.isDeveloper = ctx.role === 'developer';
        ctx.isTeacher   = ctx.isDeveloper || ctx.role === 'administrator' || ctx.role === 'teacher';
        ctx.isStudent   = ctx.role === 'student';

        ctx.userId = session.userId;
        ctx.studentId = ctx.isStudent ? session.userId : ctx.query.student_id;
    }

    yield next;
};
