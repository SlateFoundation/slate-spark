/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.assess.Footer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-assess-footer',

    config: {
        layout: 'hbox',
        defaults: {
            xtype: 'button',
            ui: 'action'
        },
        items: [
            {
                text: 'Assign Learns'
            },
            {
                xtype: 'component',
                width: '16'
            },
            {
                text: 'Schedule Interaction'
            },
            {
                xtype: 'component',
                flex: 1
            },
            {
                text: 'Mark Standard Complete',
                iconCls: 'fa fa-check'
            }
        ]
    }
});