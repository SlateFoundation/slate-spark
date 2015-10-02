/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Conference', {
    extend: 'Ext.data.ChainedStore',

    source: 'SectionStudents',
    filters: [{
        property: 'GPSStatus',
        value: 'conference'
    }]
});