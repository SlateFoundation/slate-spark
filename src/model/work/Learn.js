/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.Learn', {
    extend: 'Ext.data.Model',

    fields: [
        'type',
        'title',
        'url',
        'dok',
        'rating',
        'score',
        'attachments',
        'vendor',
        {
            name: 'completed',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'student_rating',
            mapping: 'rating.student'
        },
        {
            name: 'teacher_rating',
            mapping: 'rating.teacher'
        }
    ]
});