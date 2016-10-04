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
        'teacher_title',
        {
            name: 'student_sparkpointid',
            calculate: function(data) {
                return data.student_id + '_' + data.id;
            }
        }, {
            name: 'sparkpoint_id', // Needed for writing
            allowNull: true,
            critical: true,
            calculate: function(data) {
                return data.id;
            }
        }
    ]
});
