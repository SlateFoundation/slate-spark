/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Priorities', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SparkClassroomTeacher.store.Students'
    ],
    
    config: {
        storeId: 'gps.Priorities',
        source: 'Students',
        filters: [
            function (student) {
                return Ext.isNumber(student.get('Priority'));
            }
        ]
    }
});