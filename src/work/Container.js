/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.Container', {
    extend: 'Ext.Container',
    requires: [
        'SparkClassroom.work.TabBar'
    ],
    xtype: 'spark-work-ct',

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