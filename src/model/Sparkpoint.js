/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Sparkpoint', {
    extend: 'SparkClassroom.model.StudentSparkpoint',
    requires: [
        'SparkClassroom.data.field.SparkDate'
    ],

    idProperty: 'code',
    fields: [
        // general sparkpoint fields
        'id',
        'code',
        'student_title',
        'teacher_title'
    ]
});