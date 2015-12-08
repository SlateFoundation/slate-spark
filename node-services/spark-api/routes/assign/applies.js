'use strict';

var util = require('../../lib/util');

function *getHandler() {
    this.throw(new Error('getHandler not implemented'), 501);
}

function *patchHandler() {
    var assignment_students = this.request.body.assignment_students,
        assignmentSection = this.request.body.assignment_section,
        checkSanity = typeof this.request.body.check_sanity === 'boolean' ? this.request.body.check_sanity : true,
        assignmentStudents,
        assignmentValues;

    /***********************************************
     | Start request body validation/sanitization  |
     ***********************************************/

    if (!this.isTeacher) {
        this.throw(
            new Error(`Only teachers can assign applies; you are logged in as a: ${this.session.accountLevel}`),
            403
        );
    }

    if (typeof assignment_students === 'object') {
        try {
            let invalidAssignmentValues = [],
                redundantStudentAssignments = [];

            assignmentStudents = util.validateNumericKeys(assignment_students);
            assignmentValues = assignmentStudents.map(studentId => assignment_students[studentId]);

            assignmentValues.forEach(function(val, i) {
                if (val !== 'required' && val !== 'recommended' && val !== 'hidden') {
                    invalidAssignmentValues.push(val);
                } else if (checkSanity && assignmentSection && assignmentSection === val) {
                    redundantStudentAssignments.push(assignmentStudents[i]);
                }
            });

            if (invalidAssignmentValues.length > 0) {
                throw new Error('valid values are: required, recommended or hidden. You passed: ' +
                    invalidAssignmentValues.join(', ')
                );
            }

            if (redundantStudentAssignments.length > 0) {
                throw new Error('redundant student assignment for student id(s): ' +
                    redundantStudentAssignments.join(', ')
                );
            }
        } catch (e) {
            this.throw(new Error('Invalid assignment_students: ' + e.message), 400);
        }
    }

    /*********************************************
     | End request body validation/sanitization  |
     *********************************************/

    this.body = {
        assignment_students: assignmentStudents,
        assignment_values: assignmentValues
    };
}

module.exports = {
    get: getHandler,
    patch: patchHandler
};
