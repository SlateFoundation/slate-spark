/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Priorities', {
    extend: 'SparkClassroomTeacher.view.gps.StudentList',
    xtype: 'spark-teacher-priorities',


    config: {
        cls: 'spark-gps-priorities',

        store: 'gps.Priorities'
    }
});