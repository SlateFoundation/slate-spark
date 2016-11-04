'use strict';

/*******************************************************************************
 * IMPORTANT: The session middleware MUST be run BEFORE the request middleware *
 *******************************************************************************/

module.exports = function *session(next) {
    var ctx = this,
        headers = ctx.headers,
        session;

    ctx.schema = 'sandbox-school';

    headers = {
        "host": "localhost:9090",
            "connection": "keep-alive",
            "x-nginx-session": "{\"firstName\": \"Jeffrey\", \"lastName\": \"Mealo\", \"userId\": 9999, \"accountLevel\": \"Developer\", \"username\": \"jmealo\"}",
            "cache-control": "no-cache",
            "x-nginx-mysql-host": "spark0",
            "x-nginx-mysql-schema": "sandbox-school",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
            "postman-token": "cd8556c5-c31a-376f-267f-d4fdefaf9831",
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, sdch",
            "accept-language": "en-US,en;q=0.8",
            "cookie": "sandbox-school-s=c5efce2608a1414e14ec746c8d02d527; openedCookie=%7B%22currentHandlerName%22%3A%22page-not-found%22%7D; gsScrollPos=; session=.eJw9zMEKgjAYAOBXif_cITe9CB4KbRT8vwxWsV2kzMy5JVSXJr570qHvAb4Rqu4K6QiLC6SATH80K2KTtwkyGVHYWmNbrtU6KkURtCVHQkfGywymJdSv5616D33z-BdGFSuTb-4ojhZPh2AsJqWiHq3kJPYdMvIUkJNynvwuLoXmKLNf54b67Jo5mb_pC0miL7U.CkL19A.Vui8nA1bEOzPwCiAfE2I3w36-uY"
    };

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
