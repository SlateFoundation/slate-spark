/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.work.assess.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-assess',
    requires: [
        'SparkClassroom.view.work.assess.StandardsGrid',
        'SparkClassroom.view.work.assess.AssignmentGrid'
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
            }
        ]
    }
});