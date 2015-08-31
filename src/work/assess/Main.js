/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-assess',
    requires: [
        'SparkClassroom.work.assess.AssessmentsGrid',
        'SparkClassroom.work.assess.LearnsGrid'
    ],

    config: {
        title: 'Assess',
        layout: 'vbox',
        items: [
            {
                xtype: 'spark-work-assess-assessmentsgrid'
            },
            {
                xtype: 'component',
                html: 'How does this standards apply to everyday life?'
            },
            {
                xtype: 'spark-work-assess-learnsgrid'
            }
        ]
    }
});