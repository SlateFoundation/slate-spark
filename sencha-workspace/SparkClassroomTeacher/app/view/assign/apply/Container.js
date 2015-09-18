/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.apply.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-assign-apply',
    requires: [
        'SparkClassroomTeacher.view.assign.apply.Grid',
        'SparkClassroomTeacher.view.assign.apply.Form'
    ],

    config: {
        title: 'Apply',
        layout: 'auto',
        margin: '0 -24', // flush with viewport
        items: [
            {
                xtype: 'spark-assign-apply-grid'
            },
            {
                docked: 'right',

                xtype: 'spark-panel',
                cls: 'dark narrow',
                title: '[Project Name] <small>Details</small>',
                width: 384,
                items: [
                    {
                        xtype: 'spark-assign-apply-form'
                    }
                ]
            }
        ]
    }
});