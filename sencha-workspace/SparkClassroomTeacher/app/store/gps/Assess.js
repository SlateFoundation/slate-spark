/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Assess', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SparkClassroomTeacher.store.Students'
    ],
    
    storeId: 'Assess',
    source: 'Students',
    filters: [
        function (student) {
            return student.get('GPSStatus') == 'Assess';
        }
    ]
});