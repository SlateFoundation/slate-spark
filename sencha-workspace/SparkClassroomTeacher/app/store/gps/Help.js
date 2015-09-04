/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Help', {
    extend: 'Ext.data.ChainedStore',
        
    storeId: 'Help',
    source: 'SectionStudents',
     
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