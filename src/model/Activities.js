/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Activities', {
    extend: 'Ext.data.Model',

    fields: [
        'FirstName',
        'LastName',
        'Activity',
        'Grade',
        'ActivityDate'
    ]
});