'use strict';

function* postHandler() {
    this.require(['sparkpoint_id', 'student_id', 'question']);

    var sparkpointId = this.query.sparkpoint_id,
        studentId = this.studentId,
        question = this.query.question,
        record;

    record = yield this.pgp.one(`
        INSERT INTO conference_questions
                    (student_id, sparkpoint_id, source, question)
             VALUES ($1, $2, $3, $4)
          RETURNING *;
          `,
        [
            studentId,
            sparkpointId,
            this.isStudent ? 'student' : 'teacher',
            question
        ]);

    record.sparkpoint = yield this.lookup.sparkpoint.idToCode(record.sparkpoint_id);

    this.body = record;
}

module.exports = {
    post: postHandler
};
