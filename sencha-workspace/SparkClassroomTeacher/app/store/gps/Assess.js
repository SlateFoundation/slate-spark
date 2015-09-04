/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Assess', {
    extend: 'Ext.data.ChainedStore',
        
    storeId: 'Assess',
    source: 'SectionStudents',
    filters: [
        function (student) {
            return student.get('GPSStatus') == 'Assess';
        }
    ]
});