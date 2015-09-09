/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * TODO: extend SparkClassroom.work.Main
 */
Ext.define('SparkClassroomTeacher.view.TabsContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-tabscontainer',
    cls: 'spark-teacher-tabscontainer',
    requires: [
        'SparkClassroomTeacher.view.TabBar'
    ],

    config: {
        autoDestroy: false,
        items: [
            {
                docked: 'top',

                xtype: 'spark-teacher-tabbar'
            }
        ]
    }
});