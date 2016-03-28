/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.ActiveStudents', {
    extend: 'SparkClassroom.store.StudentSparkpoints',
    requires: [
        'Slate.proxy.API'
    ],


    config: {
        // filter out activity that didn't match a student in the active roster
        filters: [{
            filterFn: function(r) {
                return r.get('student');
            }
        }]
    }
});