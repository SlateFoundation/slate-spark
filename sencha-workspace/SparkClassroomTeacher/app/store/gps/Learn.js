/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Learn', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SparkClassroomTeacher.store.Students'
    ],
    
    config: {
        storeId: 'gps.Learn',
        source: 'Students',
        filters: [
            {
                filterFn: function (student) {
                    return student.get('GPSStatus') == 'Learn';
                }
            }
        ]
    }
});