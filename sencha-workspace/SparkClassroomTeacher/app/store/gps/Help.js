/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Help', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SparkClassroomTeacher.store.Students'
    ],
        
    storeId: 'Help',
    source: 'Students',
     
    grouper: {
        direction: 'DESC',
        groupFn: function (item) {
           //Force all records into help group
            return 'Help';
        }
    },
    filters: [
        {
            filterFn: function (student) {
                return student.get('Help');
            }
        }
    ]
});