/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.TabsContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-student-tabscontainer',
    cls: 'spark-student-tabscontainer',
    requires: [
        'SparkClassroom.work.TabBar'
    ],

    config: {
        itemId: 'page-wrap',
        cls: 'page-wrap',
        autoDestroy: false,
        items: [
            {
                docked: 'top',
                xtype: 'spark-work-tabbar'
            }
        ]
    }
});