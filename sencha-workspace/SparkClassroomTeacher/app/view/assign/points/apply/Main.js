/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.apply.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-assign-points-apply',
    requires: [
        'SparkClassroomTeacher.view.assign.points.apply.Grid',
        'SparkClassroomTeacher.view.assign.points.apply.Form'
    ],

    config: {
        title: 'Apply',
        layout: 'hbox',
        items: [
            {
                xtype: 'spark-assign-points-apply-grid',
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
                        xtype: 'spark-assign-points-apply-form'
                    }
                ]
            }
        ]
    }
});