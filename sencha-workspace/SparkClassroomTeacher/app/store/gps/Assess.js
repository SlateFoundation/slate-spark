/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Assess', {
    extend: 'Ext.data.ChainedStore',

    source: 'SectionStudents',
    filters: [{
        property: 'GPSStatus',
        value: 'assess'
    }]
});