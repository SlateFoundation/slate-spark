/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.assess.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-assess',
    requires: [
        'SparkClassroom.view.work.assess.StandardsGrid',
        'SparkClassroomStudent.view.work.assess.RatingTable',
        'SparkClassroomStudent.view.work.assess.ApplyTable',
    ],

    config: {
        title: 'Learn &amp; Practice',
        layout: 'vbox',
        items: [
            {
                xtype: 'component',
                html: 'Select an Assessment'
            },
            {
                xtype: 'spark-work-assess-standardsgrid'
            },
            {
                xtype: 'container',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'titlebar',
                        title: 'Reflection'
                    },
                    {
                        xtype: 'textareafield',
                        labelAlign: 'top',
                        label: 'How does this standard apply to everyday life?',
                        placeHolder: 'Write a paragraph about what you\'ve learned with tihs standard'
                    }
                ]
            },
            {
                xtype: 'spark-work-assess-ratingtable'
            },
            {
                xtype: 'spark-work-assess-applytable'
            },
            {
                xtype: 'toolbar',
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