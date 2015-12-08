'use strict';

var util = require('../../lib/util');

function *getHandler() {
    this.throw(new Error('getHandler not implemented'), 501);
}

function *patchHandler() {
    var required_students = this.request.body.required_students,
        assignment_students = this.request.body.assignment_students,
        checkSanity = typeof this.request.body.check_sanity === 'boolean' ? this.request.body.check_sanity : true,
        required_section = this.request.body.required_section,
        assignmentSection = this.request.body.assignment_section,
        requiredSection,
        assignmentStudents,
        assignmentValues,
        requiredStudents,
        requiredValues;

    /***********************************************
     | Start request body validation/sanitization  |
     ***********************************************/

    if (!this.isTeacher) {
        this.throw(
            new Error(`Only teachers can assign learns; you are logged in as a: ${this.session.accountLevel}`),
            403
        );
    }

    if (required_section) {
        requiredSection = parseInt(required_section, 10);

        if (isNaN(requiredSection)) {
            this.throw(new Error(`required_section must be numeric, you passed: ${required_section}`), 400);
        }
    }

    if (!(assignmentSection === undefined ||
        assignmentSection === 'required' ||
        assignmentSection === 'recommended' ||
        assignmentSection === 'hidden')) {

        this.throw(
            new Error(`assignment_section must be: required, recommended or hidden. You passed: ${assignmentSection}`),
            400
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

    if (typeof required_students === 'object') {
        try {
            let invalidRequiredValues = [],
                redundantRequiredStudents = [];

            requiredStudents = util.validateNumericKeys(required_students);
            requiredValues = requiredStudents.map(studentId => parseInt(required_students[studentId], 10));

            requiredValues.forEach(function(val, i) {
                if (isNaN(val)) {
                    invalidRequiredValues.push(val);
                } else if (checkSanity && assignmentSection && assignmentSection === val) {
                    redundantRequiredStudents.push(requiredStudents[i]);
                }
            });

            if (invalidRequiredValues.length > 0) {
                throw new Error('non-numeric values passed: ' + invalidRequiredValues.join(', '));
            }

            if (redundantRequiredStudents.length > 0) {
                throw new Error('redundant student requirement for student id(s): ' +
                    redundantRequiredStudents.join(', ')
                );
            }
        } catch (e) {
            this.throw(new Error('Invalid required_students: ' + e.message), 400);
        }
    }
    /*********************************************
     | End request body validation/sanitization  |
     *********************************************/

    this.body = {
        required_students: requiredStudents,
        required_values: requiredValues,
        assignment_students: assignmentStudents,
        assignment_values: assignmentValues
    };
}

module.exports = {
    get: getHandler,
    patch: patchHandler
};
