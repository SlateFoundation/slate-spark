/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-work-ct',
    requires: [
        'SparkClassroom.work.TabBar'
    ],

    config: {
        autoDestroy: false,
        layout: 'auto',
        items: [
            {
                xtype: 'spark-work-tabbar',
                docked: 'top'
            }
        ]
    }
});