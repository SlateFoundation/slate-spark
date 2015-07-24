/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Header', {
    extend: 'Ext.Container',
    xtype: 'spark-gps-header',

    config: {
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [
            {
                xtype: 'container',
                flex: 1,
                html: 'Learn &amp; Practice'
            },
            {
                xtype: 'container',
                flex: 1,
                html: 'Conference'
            },
            {
                xtype: 'container',
                flex: 1,
                html: 'Apply'
            },
            {
                xtype: 'container',
                flex: 1,
                html: 'Assess'
            },
            {
                xtype: 'container',
                flex: 1,
                html: 'Priorities'
            }
        ]
    }
});