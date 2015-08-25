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
        layout: 'hbox',
        items: [
            {
                xtype: 'spark-assign-apply-grid',
                width: '75%'
            },
            {
                xtype: 'container',
                width: '25%',
                items: [
                    {
                        xtype: 'titlebar',
                        title: 'Project Details'
                    },
                    {
                        xtype: 'spark-assign-apply-form'
                    }
                ]
            }
        ]
    }
});