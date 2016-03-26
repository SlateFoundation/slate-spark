/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.learns.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-assign-learns',
    requires: [
        'Ext.field.Number',
        'SparkClassroomTeacher.view.assign.learns.Grid',
        'SparkClassroom.widget.DiscussionList'
    ],


    config: {
        title: 'Learn &amp; Practice',
        margin: '0 -24', // flush with viewport
        items: [
            {
                xtype: 'spark-teacher-assign-learns-grid'
            },
            {
                docked: 'top',

                xtype: 'numberfield',
                cls: 'content-card compact',
                labelAlign: 'left',
                labelWidth: 350,
                width: 500,
                label: 'Number of Learns required for CCSS.ELA.3.CC.4.A',
                minValue: 1,
                maxValue: 15,
                stepValue: 1,
                placeHolder: 5
            },
            {
                docked: 'right',

                xtype: 'spark-panel',
                cls: 'dark narrow',
                title: 'Discussion',
                width: 288,
                items: [
                    {
                        xtype: 'spark-discussion-list',
                        data: [
                            { authorName: 'Al Motley', authorUrl: '#', timestamp: '12/05/15 5:47pm', text: 'This is a teacher’s comment. Lorem ipsum' },
                            { authorName: 'Ali Wiest', authorUrl: '#', timestamp: '12/05/15 5:47pm', text: 'This is a teacher’s comment.' }
                        ]
                    },
                    {
                        xtype: 'textareafield',
                        label: 'Bill',
                        placeHolder: 'Leave a comment…',
                        margin: '16 0 0'
                    }
                ]
            }
        ]
    }
});