/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomStudent.store.HelpRequests', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkClassroomStudent.model.HelpRequest'
    ],

    model: 'SparkClassroomStudent.model.HelpRequest'
});