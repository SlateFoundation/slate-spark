/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.ConferenceQuestion', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id',
            'question',
            'gradeLevel'
        ]
    }
});
