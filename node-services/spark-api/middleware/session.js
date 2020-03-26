/*******************************************************************************
 * IMPORTANT: The session middleware MUST be run BEFORE the request middleware *
 *******************************************************************************/

async function sessionMiddleware(ctx, next) {
    var headers = ctx.headers,
        httpSession;

    if (headers['x-nginx-session']) {
        try {
            httpSession = JSON.parse(headers['x-nginx-session']);
        } catch (e) {
            ctx.throw(new Error('Invalid JSON in x-nginx-session: ' + e.message), 400);
        }

        ctx.firstName = httpSession.firstName;
        ctx.lastName = httpSession.lastName;

        ctx.role = httpSession.accountLevel.toLowerCase();
        ctx.username = httpSession.username;
        ctx.session = httpSession;
        ctx.schema = ctx.header['x-nginx-mysql-schema'] || 'sandbox-school';

        // TODO: isRole is an anti-pattern, hasRole is better (a developer is NOT a teacher; but has the rights of one)
        ctx.isDisabled = ctx.role === 'disabled';
        ctx.isAdmin = ctx.role === 'administrator';
        ctx.isDeveloper = ctx.role === 'developer';
        ctx.isTeacher   = ctx.isDeveloper || ctx.role === 'administrator' || ctx.role === 'teacher';
        ctx.isStudent   = ctx.role === 'student';

        ctx.userId = httpSession.userId;
        ctx.studentId = ctx.isStudent ? httpSession.userId : ctx.query.student_id;
    }

    await next();
}

module.exports = sessionMiddleware;
