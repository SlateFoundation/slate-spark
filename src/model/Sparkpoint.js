/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Sparkpoint', {
    extend: 'SparkClassroom.model.StudentSparkpoint',

    idProperty: 'code',
    fields: [
        // general sparkpoint fields
        'id',
        'code',
        'student_title',
        'teacher_title',

        // student-personalized results
        {
            name: 'last_accesssed',
            type: 'sparkdate'
        },
        {
            name: 'recommender_id',
            type: 'int',
            allowNull: true
        },
        {
            name: 'recommended',
            mapping: 'recommender_id',
            convert: function(v) {
                return !!v;
            }
        }
    ]
});