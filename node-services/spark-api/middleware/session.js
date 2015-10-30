'use strict';

// This should be loaded BEFORE request

module.exports = function *parseSession(next) {
    var headers = this.headers,
        query = this.query,
        session;

    if (headers['x-nginx-session']) {
        try {
            session = JSON.parse(headers['x-nginx-session']);
        } catch (e) {
            throw new Error('Invalid JSON in x-nginx-session: ' + e.message);
        }

        this.isStudent   = session.accountLevel === 'Student';
        this.isTeacher   = session.accountLevel === 'Teacher';
        this.isDeveloper = session.accountLevel === 'Developer';

        this.userId = session.userId;
        this.studentId = this.isStudent ? session.userId : query.student_id;
    }

    if (!this.userId) {
        this.throw('Authentication required', 403);
    }

    yield next;
};
