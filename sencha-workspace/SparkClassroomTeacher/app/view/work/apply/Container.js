/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.apply.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-apply',
    requires: [
        'SparkClassroomTeacher.view.work.apply.Main',
        'SparkClassroomTeacher.view.work.apply.Sidebar'
    ],

    config: {
        items: [
            {
                xtype: 'spark-teacher-work-apply-main'
            },
            {
                docked: 'right',
                cls: 'sidebar-col',
                xtype: 'spark-teacher-work-apply-sidebar'
            }
        ]
    }
});