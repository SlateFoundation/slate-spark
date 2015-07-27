/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.work.assess.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-assess',
    requires: [
        'SparkClassroom.view.work.assess.StandardsGrid',
        'SparkClassroom.view.work.assess.AssignmentGrid',
        'SparkClassroom.view.work.assess.ProjectGrid'
    ],

    config: {
        title: 'Assess',
        layout: 'vbox',
        items: [
            {
                xtype: 'spark-work-assess-standardsgrid'
            },
            {
                xtype: 'component',
                html: 'How does this standards apply to everyday life?'
            },
            {
                xtype: 'spark-work-assess-assignmentgrid'
            },
            {
                xtype: 'spark-work-assess-projectgrid',
                userClass: 'Teacher'
            },
            {
                xtype: 'toolbar',
                userClass: 'Teacher',
                items: [
                    {
                        xtype: 'button',
                        text: 'Assign Learns'
                    },
                    {
                        xtype: 'button',
                        text: 'Schedule Interaction'
                    },
                    {
                        xtype: 'button',
                        text: 'Standard Completed'
                    }
                ]
            },
            {
                xtype: 'toolbar',
                userClass: 'Student',
                items: [
                    {
                        xtype: 'button',
                        text: 'Submit for Grading'
                    }
                ]
            }
        ]
    }
});