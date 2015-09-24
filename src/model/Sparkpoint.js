/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Sparkpoint', {
    extend: 'Ext.data.Model',

    idProperty: 'code',
    fields: [
        // general sparkpoint fileds
        'code',
        'student_title',
        'teacher_title',

        // student-specific metadata
        {
            name: 'recommended',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'completed_date',
            type: 'date',
            dateFormat: 'timestamp'
        }
    ]
});