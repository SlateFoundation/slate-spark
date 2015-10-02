/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-assess',
    requires: [
        'SparkClassroom.widget.Panel',
        'SparkClassroom.widget.SimpleHeading',
        'SparkClassroom.work.assess.AssessmentsGrid',
        'SparkClassroom.work.assess.LearnsGrid'
    ],

    config: {
        itemId: 'assess',

        items: [
            {
                xtype: 'spark-simpleheading',
                cls: 'spark-view-headline',
                level: 1,
                html: 'Select an Assessment'
            },
            {
                xtype: 'spark-work-assess-assessmentsgrid'
            },
            {
                xtype: 'spark-panel',
                title: 'Reflection',
                items: [
                    {
                        xtype: 'textareafield',
                        label: 'How does this standard apply to everyday life?',
                        placeHolder: 'Write a paragraph about what you’ve learned with this standard.'
                    }
                ]
            },
            {
                xtype: 'spark-work-assess-learnsgrid'
            }
        ]
    }
});