/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.learn.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-learn',
    requires: [
        'SparkClassroomStudent.view.learn.AssignmentGrid'
    ],

    config: {
        title: 'Learn &amp; Practice',
        layout: 'vbox',
        items: [
            {
                xtype: 'container',
                items: [
                    {
                        xtype: 'component',
                        html: 'You\'ve completed 3 outof 5 required learns'
                    },
                    {
                        xtype: 'spark-learn-assignmentgrid'
                    }
                ]
            },
            {
                xtype: 'component',
                html: 'Standard 2'
            },
            {
                xtype: 'component',
                html: 'Standard 1'
            }
        ]
    }
});