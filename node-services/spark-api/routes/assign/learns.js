'use strict';

var util = require('../../lib/util');

function *getHandler() {
    this.throw(new Error('getHandler not implemented'), 501);
}

function *patchHandler() {
    var requestBody = this.request.body,
        required_students = this.request.body.required_students,
        assignment_students = this.request.body.assignment_students,
        checkSanity = typeof this.request.body.check_sanity === 'boolean' ? this.request.body.check_sanity : true,
        required_section = this.request.body.required_section,
        assignmentSection = this.request.body.assignment_section,
        resource_id = this.request.body.resource_id,
        resourceId = parseInt(resource_id, 10),
        sparkpointId = this.query.sparkpoint_id,
        sectionId = this.query.section_id,
        requiredSection,
        assignmentStudents,
        assignmentValues,
        requiredStudents,
        requiredValues,
        allowedKeys = [
            'resource_id',
            'assignment_section',
            'assignment_students',
            'required_section',
            'required_students',
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

    this.require(['section_id', 'sparkpoint_id']);

    if (!this.isTeacher) {
        this.throw(
            new Error(`Only teachers can assign learns; you are logged in as a: ${this.session.accountLevel}`),
            403
        );
    }

    invalidKeys = Object.keys(this.request.body).filter(key => allowedKeys.indexOf(key) === -1);

    if (invalidKeys.length > 0) {
        this.throw(new Error(`Allowed keys are ${allowedKeys.join(', ')}; you passed: ${invalidKeys.join(', ')}`), 400);
    }

    if (required_section) {
        if (required_section === null) {
            requiredSection = null;
        } else {
            requiredSection = parseInt(required_section, 10);

            if (isNaN(requiredSection)) {
                this.throw(new Error(`required_section must be numeric or null, you passed: ${required_section}`), 400);
            }
        }
    }

    if (!(assignmentSection === undefined ||
        assignmentSection === 'required' ||
        assignmentSection === 'recommended' ||
        assignmentSection === 'hidden' ||
        assignmentSection === null)) {

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
                if (val !== 'required' && val !== 'recommended' && val !== 'hidden' && val !== null) {
                    invalidAssignmentValues.push(val);
                } else if (checkSanity && assignmentSection && assignmentSection === val && val !== null) {
                    redundantStudentAssignments.push(assignmentStudents[i]);
                }
            });

            if (invalidAssignmentValues.length > 0) {
                throw new Error('valid values are: required, recommended, hidden or null. You passed: ' +
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

    if (resource_id !== undefined && isNaN(resourceId)) {
        this.throw(new Error(`resource_id must be numeric, you provided: ${resource_id}`), 400);
    }

    if ((assignmentSection || assignmentStudents) && resource_id === undefined) {
        this.throw(new Error('resource_id is required when assignment_section or assignment_students provided.'), 400);
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
