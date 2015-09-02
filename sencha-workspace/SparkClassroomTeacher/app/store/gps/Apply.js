/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Apply', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SparkClassroomTeacher.store.Students'
    ],
    
    storeId: 'Apply',
    source: 'Students',
    filters: [
        function (student) {
            return student.get('GPSStatus') == 'Apply';
        }
    ]
    
});