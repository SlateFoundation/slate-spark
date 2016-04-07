'use strict';

var sectionStudents = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
    ],

    util = require('./lib/util'),
    QueryBuilder = util.QueryBuilder;

function UniqueValues(values) {
    this.values = values || [];
}

UniqueValues.prototype.push = function push(val) {
    var idx = this.values.indexOf(val);

    if (idx === -1) {
        idx = this.values.push(val);
    }

    return '$' + (idx + 1);
};

function RecordBalancer(options) {
    var valueCount = {},
        recordsById = {},
        majorityCount = 0,
        majorityValue = null,
        valuesById = {},
        records,
        students,
        idKey,
        balanceKey,
        defaultValue,
        individualStudents = [],
        groupStudents = [],
        queries = [],
        vals = new UniqueValues(),
        individualTableName,
        idColumn,
        partitionColumn,
        partitionValue,
        balanceColumn;

    Object.assign(this, {
        idKey: 'id',
        idColumn: 'student_id',
        partitionKey: 'section',
        partitionColumn: 'section_id',
        partitionValue: null,
        records: [],
        students: [],
        balanceKey: null,
        balanceColumn: null,
        defaultValue: null,
        groupTableName: null,
        individualTableName: null,
        insertColumns: null,
        conflictColumns: null
    }, options);

    this.balanceColumn = this.balanceColumn || this.balanceKey;
    this.idColumn = this.idColumn || this.idKey;
    this.partitionColumn = this.partitionColumn || this.partitionKey;

    // Check for required parameters

    if (!this.balanceKey) {
        throw new Error('balanceKey is a required parameter');
    }

    if (!this.partitionColumn) {
        throw new Error('partitionColumn is a required parameter');
    }

    if (!this.partitionValue) {
        throw new Error('partitionValue is a required parameter');
    }

    if (!this.individualTableName) {
        throw new Error('individualTableName is a required parameter');
    }

    if (!this.groupTableName) {
        throw new Error('groupTableName is a required parameter');
    }


    if (typeof this.records !== 'object') {
        throw new Error(`An array of record objects or an object keyed by ${this.idKey} is required.`);
    }

    records = this.records;
    students = this.students;
    idKey = this.idKey;
    balanceKey = this.balanceKey;
    defaultValue = this.defaultValue;
    individualTableName = this.individualTableName;
    idColumn = this.idColumn;
    partitionColumn = this.partitionColumn;
    partitionValue = this.partitionValue;
    balanceColumn = this.balanceColumn;

    /*
     // Lookup numeric section id if code was passed
     if (typeof sectionId === 'string') {
     sectionId = yield pgp.one(
     "SELECT 'ID' FROM course_sections WHERE 'Code' = $1)",
     [sectionId]
     );
     sectionId = sectionId.ID;
     }

     // Look up student ids in a given section if an array is not provided
     if (!Array.isArray(students)) {
     students = yield pgp.any(
     `SELECT PersonID FROM course_section_participants WHERE CourseSectionID = $1`,
     [sectionId]
     );
     students.map(student => student.PersonID);
     }*/

    if (Array.isArray(this.records)) {
        records.forEach(function (record) {
            recordsById[record[idKey]] = record;
            valuesById[record[idKey]] = record[balanceKey] || defaultValue;
        });
    } else {
        recordsById = records;

        for (let key in records) {
            let record = records[key];

            if (typeof record === 'object') {
                valuesById[key] = record[balanceKey];
            } else {
                valuesById[key] = record;
            }
        }
    }

    students.forEach(function (student) {
        var val = valuesById[student] || (valuesById[student] = defaultValue),
            count = (valueCount[val] || 0) + 1;

        if (count >= majorityCount) {
            majorityCount = count;
            majorityValue = val;
        }

        valueCount[val] = count;
    });

    if (majorityCount === 1) {
        // There is no majority, all records should be balanced as record-per-student
        individualStudents = students;
    } else {
        students.forEach(id => ((valuesById[id] !== majorityValue) ? individualStudents : groupStudents).push(id));
    }

    // Delete per-student records for group students
    if (groupStudents.length > 0) {
        queries.push(`
            DELETE FROM ${individualTableName}
                  WHERE ${partitionColumn} = ${vals.push(partitionValue)}
                    AND ${idColumn} = ANY(ARRAY[${groupStudents.map(id => vals.push(id)).join(',')}]);`
        );
    }

    individualStudents.forEach(function(studentId) {
        queries.push(`INSERT INTO ${individualTableName} (${idColumn}, ${partitionColumn}, ${balanceColumn}) VALUES(${vals.push(studentId)}, ${vals.push(partitionValue)});`);
    });

    console.log({
        individualStudents: individualStudents,
        groupStudents: groupStudents,
        recordsSaved: students.length - ((groupStudents.length > 1 ? 1: 0) + individualStudents.length),
        majorityCount: majorityCount,
        majorityValue: majorityValue,
        values: Object.keys(valueCount),
        queries: queries,
        vals: vals.values
    });
}

// All students in a section (explicit)
var exampleRecordBalancer1 = new RecordBalancer({
    balanceKey: 'preference',
    individualTableName: 'student_learn_preferences',
    groupTableName: 'section_learn_preferences',
    partitionKey: 'section_id',
    partitionValue: 'Geometry',
    students: sectionStudents,
    records: {
        '1': 'required',
        '2': 'required',
        '3': 'required',
        '4': 'required',
        '5': 'required',
        '6': 'required',
        '7': 'required',
        '8': 'required',
        '9': 'required',
        '10': 'required',
        '11': 'required',
        '12': 'required',
        '13': 'required',
        '14': 'required',
        '15': 'required',
        '16': 'required',
        '17': 'required',
        '18': 'required',
        '19': 'required',
        '20': 'required',
        '21': 'required',
        '22': 'required',
        '23': 'required',
        '24': 'required',
        '25': 'required',
        '26': 'required',
        '27': 'required',
        '28': 'required',
        '29': 'required',
        '30': 'required'
    }
});

// All students in a section (implicit)
var exampleRecordBalancer2 = new RecordBalancer({
    balanceKey: 'preference',
    individualTableName: 'student_learn_preferences',
    groupTableName: 'section_learn_preferences',
    partitionValue: 'Geometry',
    partitionKey: 'section_id',
    students: sectionStudents,
    defaultValue: 'required'
});

// 50/50 Split
var exampleRecordBalancer3 = new RecordBalancer(
    {
        balanceKey: 'preference',
        individualTableName: 'student_learn_preferences',
        groupTableName: 'section_learn_preferences',
        partitionValue: 'Geometry',
        partitionKey: 'section_id',
        students: sectionStudents,
        records: {
            '1': 'required',
            '2': 'required',
            '3': 'required',
            '4': 'required',
            '5': 'required',
            '6': 'required',
            '7': 'required',
            '8': 'required',
            '9': 'required',
            '10': 'required',
            '11': 'required',
            '12': 'required',
            '13': 'required',
            '14': 'required',
            '15': 'required',
            '16': 'recommended',
            '17': 'recommended',
            '18': 'recommended',
            '19': 'recommended',
            '20': 'recommended',
            '21': 'recommended',
            '22': 'recommended',
            '23': 'recommended',
            '24': 'recommended',
            '25': 'recommended',
            '26': 'recommended',
            '27': 'recommended',
            '28': 'recommended',
            '29': 'recommended',
            '30': 'recommended'
        }
    });

// 3-Way Split (explicit)
var exampleRecordBalancer4 = new RecordBalancer(
    {
        balanceKey: 'preference',
        individualTableName: 'student_learn_preferences',
        groupTableName: 'section_learn_preferences',
        partitionValue: 'Geometry',
        partitionKey: 'section_id',
        students: sectionStudents,
        records: {
            '1': 'required',
            '2': 'required',
            '3': 'required',
            '4': 'required',
            '5': 'required',
            '6': 'required',
            '7': 'required',
            '8': 'required',
            '9': 'required',
            '10': 'required',
            '11': 'hidden',
            '12': 'hidden',
            '13': 'hidden',
            '14': 'hidden',
            '15': 'hidden',
            '16': 'hidden',
            '17': 'hidden',
            '18': 'hidden',
            '19': 'hidden',
            '20': 'hidden',
            '21': 'recommended',
            '22': 'recommended',
            '23': 'recommended',
            '24': 'recommended',
            '25': 'recommended',
            '26': 'recommended',
            '27': 'recommended',
            '28': 'recommended',
            '29': 'recommended',
            '30': 'recommended'
        }
    });

// Odd Only, 3-Way Split
var exampleRecordBalancer5 = new RecordBalancer(
    {
        balanceKey: 'preference',
        individualTableName: 'student_learn_preferences',
        groupTableName: 'section_learn_preferences',
        partitionValue: 'Geometry',
        students: sectionStudents,
        records: {
            '1': 'required',
            '3': 'required',
            '5': 'required',
            '7': 'required',
            '9': 'required',
            '11': 'hidden',
            '13': 'hidden',
            '15': 'hidden',
            '17': 'hidden',
            '19': 'hidden',
            '21': 'recommended',
            '23': 'recommended',
            '25': 'recommended',
            '27': 'recommended',
            '29': 'recommended'
        }
    });

// Array of objects, Odd Only, 3-Way Split
var exampleRecordBalancer6 = new RecordBalancer(
    {
        balanceKey: 'preference',
        individualTableName: 'student_learn_preferences',
        groupTableName: 'section_learn_preferences',
        partitionValue: 'Geometry',
        partitionKey: 'section_id',
        students: sectionStudents,
        records: [
            {id: '1', preference: 'required'},
            {id: '3', preference: 'required'},
            {id: '5', preference: 'required'},
            {id: '7', preference: 'required'},
            {id: '9', preference: 'required'},
            {id: '11', preference: 'hidden'},
            {id: '13', preference: 'hidden'},
            {id: '15', preference: 'hidden'},
            {id: '17', preference: 'hidden'},
            {id: '19', preference: 'hidden'},
            {id: '21', preference: 'recommended'},
            {id: '23', preference: 'recommended'},
            {id: '25', preference: 'recommended'},
            {id: '27', preference: 'recommended'},
            {id: '29', preference: 'recommended'}
        ]
    });
