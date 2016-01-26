'use strict';

var util = require('../../lib/util'),
    Values = util.Values;

function *getHandler() {
    var results = yield util.selectFromRequest.call(this, 'learn_assignments');
    this.body = results.map(util.codifyRecord.bind(this));
}

function *patchHandler() {
    let validator = this.validation.learn_assignments,
        body = this.request.body,
        errors = [],
        vals = new Values(),
        sqlStatements = [],
        ctx = this;

    if (this.method === 'POST') {
        body = [body];
    }

    if (!Array.isArray(body)) {
        return this.throw(new Error('PATCH request body must be an array of learn assignments.'), 400);
    }

    function recordToInsert(record, vals) {
        var keys = Object.keys(record),
            values = keys.map(col => vals.push(record[col]));

        return `INSERT INTO learn_assignments (${keys.join(', ')}) VALUES(${values.join(', ')})`;
    }

    function recordToSelect(record, vals) {
        return 'SELECT * FROM learn_assignments '  + util.recordToWhere(record, vals);
    }

    function recordToDelete(record, vals) {
        return 'DELETE FROM learn_assignments ' + util.recordToWhere(record, vals);
    }

    body.forEach(function(record) {

        record = util.identifyRecord(record, ctx.lookup);

        let validationErrors = validator(record);

        delete record.assignment_date;

        if (validationErrors) {
            if (validationErrors.length === 1 && record.assignment === null) {
                // Assignment is null which is an implied delete, we can ignore this validation error, provided that it
                // is the only validation error
                delete record.assignment;
                sqlStatements.push(recordToDelete(record, vals));
            } else {
                errors.push({
                    input: record,
                    errors: validationErrors
                });
            }
        } else {
            sqlStatements.push(recordToInsert(record, vals));
        }
    });

    if (errors.length > 0) {
        this.status = 400;
        return this.body = {
            success: false,
            errors: errors
        };
    }

    yield this.pgp.none(sqlStatements.join(';\n') + ';', vals.vals)
        .then(function() {
            ctx.body = { success: true };
        }).catch(function(e) {
            var error = { message: e.toString() };
            Object.assign(error, e);

            ctx.status = 500;

            ctx.body = {
                success: false,
                errors: [error]
            };
        });

    if (this.method === 'POST') {
        vals = new Values();
        this.body = yield ctx.pgp.oneOrNone(recordToSelect(body[0], vals), vals.vals);
    }
}

/*
function APIRequest(request, response) {

}


var request, response;

const ASSIGNMENT_TYPES = ['required', 'recommended', 'hidden', 'exempt'];

function codeToId(obj) {
    if (obj.section_code) {
        // TODO: use lookup
        obj.section_id = obj.section_code;
        delete obj.section_code;
    }

    if (obj.sparkpoint_code) {
        obj.sparkpoint_id = obj.sparkpoint_code;
        delete obj.sparkpoitn_code;
    }

    return obj;
}

function normalizeRequest(req) {
    var errors = {};

    req = codeToId(req);

    if (req.section_id && util.isGtZero(req.section_id)) {
        errors.section_id = 'should be undefined or a number greater than zero';
    }

    if (req.sparkpoint_id && !util.isMatchbookId(req.sparkpoint_id)) {
        errors.sparkpoint_id = 'should be undefined or an 7 character hexadecimal prefixed by M';
    }

    if (req.requirements) {
        if (Array.isArray(req.requirements)) {
            req.requirements.map = req.requirements.map(normalizeRequirement, req);
        } else {
            errors.requirements = 'expected an array of requirement objects or undefined';
        }
    }

    if (req.assignments) {

        if (Array.isArray(req.assignments)) {
            req.assignments.map = req.assignments.map(normalizeAssignment, req);
        } else {
            errors.assignments = 'expected an array of assignment objects or undefined';
        }
    }

    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors, null, "\t"));
    }
}

function normalizeRequirement(item) {
    var req = this.req,
        errors = this.errors;

    if (typeof item !== 'object') {
        errors.push('A requirement must be an object');
    }

    item.section_id || (item.section_id = req.section_id);
    item.sparkpoint_id || (item.sparkpoint_id = req.sparkpoint_id);

    item = codeToId(item);

    if (!item.section_id) {
        errors.push('A section_id or section_code must be specified in the request envelope or requirement object');
    }

    if (!item.sparkpoint_id) {
        errors.push('A sparkpoint_id or sparkpoint_code must be specified in the request envelope or requirement object');
    } else if (!util.isMatchbookId(item.sparkpoint_id)) {
        errors.push(`A sparkpoint_id should be a 7 character hexadecimal id prefixed by M, not: ${item.sparkpoint_id}`);
    }

    if (item.students) {
        if (typeof item.students !== 'object' || Array.isArray(item.students)) {
            if (item.students === null) {
                // Passing null to students deletes all student-level records

                let sql = `
                DELETE
                  FROM learns_required
                 WHERE student_id IS NOT NULL
                   AND sparkpoint_id = ${item.sparkpoint_id}
                   AND section_id = ${item.section_id}
                 `;

            } else {
                errors.push('students must be undefined, null, or an object where the key is a student_id and the value is an assignment');
            }
        } else {
            for (var studentId in item.students) {
                let requirement = item.students[studentId];

                if (!util.isGtZero(studentId)) {
                    errors.push(`student_id must be greater than or equal to zero; you passed: ${studentId}`);
                }

                if (!util.isGteZero(requirement)) {
                    errors.push(`requirement must be a number greater than or equal to zero; you passed: ${requirement}`)
                }
            }
        }
    }

    if (item.section !== undefined && !util.isGteZero(item.section)) {
        errors.push(`section must be undefined or a number greater than or equal to zero; you passed: ${item.section}`);
    }
}

function isAssignmentType(str) {
    return ASSIGNMENT_TYPES.indexOf(str) !== -1;
}

function normalizeAssignment(item, req) {
    var req = this.req,
        errors = this.errors;

    if (typeof item !== 'object') {
        errors.push('An assignment must be an object');
    }

    item.section_id || (item.section_id = req.section_id);
    item.sparkpoint_id || (item.sparkpoint_id = req.sparkpoint_id);

    item = codeToId(item);

    if (!item.section_id) {
        errors.push('A section_id or section_code must be specified in the request envelope or requirement object');
    }

    if (!item.sparkpoint_id) {
        errors.push('A sparkpoint_id or sparkpoint_code must be specified in the request envelope or requirement object');
    } else if (!util.isMatchbookId(item.sparkpoint_id)) {
        errors.push(`A sparkpoint_id should be a 7 character hexadecimal id prefixed by M, not: ${item.sparkpoint_id}`);
    }

    if (item.students) {
        if (typeof item.students !== 'object' || Array.isArray(item.students)) {
            errors.push('students must be undefined or an object where the key is a student_id and the value is an assignment');
        }

        for (var studentId in item.students) {
            let assignment = item.students[studentId];

            if (!util.isGtZero(studentId)) {
                errors.push('student_id must be greater than or equal to zero, you passed: ' + studentId);
            }

            if (!isAssignmentType(assignment)) {
                errors.push(`Invalid assignment type: ${assignment}; valid values are: ${ASSIGNMENT_TYPES.join(', ')}`);
            }
        }
    }

    if (item.section) {
        if (!isAssignmentType(item.section)) {
            errors.push(`Invalid assignment type: ${assignment}; valid values are: ${ASSIGNMENT_TYPES.join(', ')}`);
        }
    }

    if (!util.isGteZero(item.resource_id)) {
        errors.push(`resource_id must be a number greater than zero, you passed: ${item.resource_id}`);
    }
}

// PATCH /assignments/learns

request = {
    "requirements": [
        {
            "students": {
                "5": 5,
                "7": 4
            },
            "sparkpoint_id": "M1000183",
            "section_code": "Math-09",
            "section": 10
        }
    ],
    "assignments": [
        {
            "resource_id": 12324,
            "students": {
                "5": "required",
                "7": "hidden"
            },
            "sparkpoint_id": "M1000183",
            "section_code": "Math-09",
            "section": "recommended"
        }
    ]
};

console.log(normalizeRequest(request));

// section_id/section_code and sparkpoint_id/sparkpoint_code may be omitted from requirement and assignment objects
// provided that they are included in the request envelope.

request = {
    "section_code": "Math-09",
    "sparkpoint_id": "M1000183",
    "requirements": [
        {
            "students": {
                "5": 5,
                "7": 4
            },
            "section": -10
        }
    ],
    "assignments": [
        {
            "resource_id": 12324,
            "students": {
                "5": "required",
                "7": "hidden"
            },
            "section": "recommended"
        }
    ]
};

function *patchHandler() {
    var errors = {};

    req = codeToId(req);

    if (req.section_id && util.isGtZero(req.section_id)) {
        errors.section_id = 'should be undefined or a number greater than zero';
    }

    if (req.sparkpoint_id && !util.isMatchbookId(req.sparkpoint_id)) {
        errors.sparkpoint_id = 'should be undefined or an 7 character hexadecimal prefixed by M';
    }

    if (req.requirements) {
        if (Array.isArray(req.requirements)) {
            req.requirements.map = req.requirements.map(normalizeRequirement, req);
        } else {
            errors.requirements = 'expected an array of requirement objects or undefined';
        }
    }

    if (req.assignments) {

        if (Array.isArray(req.assignments)) {
            req.assignments.map = req.assignments.map(normalizeAssignment, req);
        } else {
            errors.assignments = 'expected an array of assignment objects or undefined';
        }
    }

    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors, null, "\t"));
    }
} */

module.exports = {
    get: getHandler,
    patch: patchHandler
};
