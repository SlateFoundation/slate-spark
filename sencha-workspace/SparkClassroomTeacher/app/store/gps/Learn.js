/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Learn', {
    extend: 'Ext.data.ChainedStore',

    source: 'SectionStudents',
    filters: [{
        property: 'GPSStatus',
        value: 'learn'
    }]
});