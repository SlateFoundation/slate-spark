/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomStudent.store.work.ConferenceResources', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkClassroomStudent.model.work.ConferenceResource'
    ],

    model: 'SparkClassroomStudent.model.work.ConferenceResource'
});
