/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.TabsContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-tabscontainer',
    requires: [
        'SparkClassroomTeacher.view.TabBar'
    ],

    config: {
        autoDestroy: false,
        baseCls: 'spark-teacher-tabscontainer',
        padding: '48 24', // TODO: shouldn't this be in SASS?
        items: [
            {
                docked: 'top',

                xtype: 'spark-teacher-tabbar'
            }
        ]
    }
});