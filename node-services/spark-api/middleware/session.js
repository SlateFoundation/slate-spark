'use strict';

// This should be loaded BEFORE request

module.exports = function *parseSession(next) {
    var headers = this.headers,
        session;

    if (headers['x-nginx-session']) {
        try {
            session = JSON.parse(headers['x-nginx-session']);
        } catch (e) {
            throw new Error('Invalid JSON in x-nginx-session: ' + e.message);
        }

        this.isDeveloper = session.accountLevel === 'Developer';
        this.isTeacher   = this.isDeveloper || session.accountLevel === 'Administrator' || session.accountLevel === 'Teacher';
        this.isStudent   = session.accountLevel === 'Student';

        this.userId = session.userId;
        this.studentId = this.isStudent ? session.userId : this.query.student_id;
        this.query.student_id = this.studentId;
        this.session = session;
    }

    if (!this.userId) {
        this.throw('Authentication required', 403);
    }

    this.set('X-Session', JSON.stringify(this.session));

    yield next;
};
