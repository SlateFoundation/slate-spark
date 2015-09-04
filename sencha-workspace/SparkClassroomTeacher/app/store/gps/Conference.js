/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Conference', {
    extend: 'Ext.data.ChainedStore',
    
    storeId: 'Conference',
    source: 'SectionStudents',
    filters: [
        function (student) {
            return student.get('GPSStatus') == 'Conference';
        }
    ]
    
});