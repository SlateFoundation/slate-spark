'use strict';

var util = require('../../lib/util');

function *getHandler() {
    this.throw(new Error('getHandler not implemented'), 501);
}

function *patchHandler() {
    var assignment_students = this.request.body.assignment_students,
        assignmentSection = this.request.body.assignment_section,
        checkSanity = typeof this.request.body.check_sanity === 'boolean' ? this.request.body.check_sanity : true,
        apply_id = this.request.body.apply_id,
        applyId = parseInt(apply_id, 10),
        sparkpointId = this.query.sparkpoint_id,
        assignmentStudents,
        assignmentValues,
        allowedKeys = [
            'apply_id',
            'assignment_section',
            'assignment_students',
            'sparkpoint_id',
            'section_id',
            'sparkpoint',
            'section',
            'check_sanity'
        ],
        invalidKeys;

    /***********************************************
     | Start request body validation/sanitization  |
     ***********************************************/

    if (!this.isTeacher) {
        this.throw(
            new Error(`Only teachers can assign applies; you are logged in as a: ${this.session.accountLevel}`),
            403
        );
    }

    this.require(['section_id', 'sparkpoint_id']);

    invalidKeys = Object.keys(this.request.body).filter(key => allowedKeys.indexOf(key) === -1);

    if (invalidKeys.length > 0) {
        this.throw(new Error(`Allowed keys are ${allowedKeys.join(', ')}; you passed: ${invalidKeys.join(', ')}`), 400);
    }

    if (typeof assignment_students === 'object') {
        try {
            let invalidAssignmentValues = [],
                redundantStudentAssignments = [];

            assignmentStudents = util.validateNumericKeys(assignment_students);
            assignmentValues = assignmentStudents.map(studentId => assignment_students[studentId]);

            assignmentValues.forEach(function(val, i) {
                // Sending a null value should delete any student-specific values for that student
                if (val !== 'required' && val !== null) {
                    invalidAssignmentValues.push(val);
                } else if (checkSanity && assignmentSection && assignmentSection === val && val !== null) {
                    redundantStudentAssignments.push(assignmentStudents[i]);
                }
            });

            if (invalidAssignmentValues.length > 0) {
                throw new Error('valid values are: required or null. You passed: ' +
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

    if (apply_id !== undefined && isNaN(applyId)) {
        this.throw(new Error(`apply_id must be numeric, you provided: ${apply_id}`), 400);
    }

    if ((assignmentSection || assignmentStudents) && apply_id === undefined) {
        this.throw(new Error('apply_id is required when assignment_section or assignment_students provided.'), 400);
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
