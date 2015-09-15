/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.TabsContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-student-tabscontainer',

    config: {
        autoDestroy: false,
        cls: ['spark-student-tabscontainer', 'page-wrap']
    }
});