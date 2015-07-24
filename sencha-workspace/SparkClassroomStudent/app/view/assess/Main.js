/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.assess.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-assess',
    requires: [
        'SparkClassroomStudent.view.assess.AssignmentGrid',
        'SparkClassroomStudent.view.assess.RatingTable',
        'SparkClassroomStudent.view.assess.ApplyTable',
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
                xtype: 'spark-assess-assignmentgrid'
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
                xtype: 'spark-assess-ratingtable'
            },
            {
                xtype: 'spark-assess-applytable'
            },
            {
                xtype: 'button',
                text: 'Submit for Grading'
            }
        ]
    }
});