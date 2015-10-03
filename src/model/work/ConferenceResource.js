/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.ConferenceResource', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id',
            'title',
            'url',
            'gradeLevel'
        ]
    }
});
