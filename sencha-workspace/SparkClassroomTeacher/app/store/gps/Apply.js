/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Apply', {
    extend: 'Ext.data.ChainedStore',
    
    storeId: 'Apply',
    source: 'SectionStudents',
    filters: [
        function (student) {
            return student.get('GPSStatus') == 'Apply';
        }
    ]
    
});