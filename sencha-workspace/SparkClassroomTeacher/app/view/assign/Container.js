/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-assign-ct',
    requires: [
        'SparkClassroomTeacher.view.assign.TabBar'
    ],

    items: [{
        xtype: 'spark-teacher-assign-tabbar'
    }]
});