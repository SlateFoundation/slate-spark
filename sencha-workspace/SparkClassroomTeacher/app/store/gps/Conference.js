/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Conference', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SparkClassroomTeacher.store.Students'
    ],
    
    storeId: 'Conference',
    source: 'Students',
    filters: [
        function (student) {
            return student.get('GPSStatus') == 'Conference';
        }
    ]
    
});