/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Apply', {
    extend: 'Ext.data.ChainedStore',

    source: 'SectionStudents',
    filters: [{
        property: 'GPSStatus',
        value: 'apply'
    }]
});