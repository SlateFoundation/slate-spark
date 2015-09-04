/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Learn', {
    extend: 'Ext.data.ChainedStore',
    
    storeId: 'Learn',
    source: 'SectionStudents',
    filters: [
        {
            filterFn: function (student) {
                return student.get('GPSStatus') == 'Learn';
            }
        }
    ]

});