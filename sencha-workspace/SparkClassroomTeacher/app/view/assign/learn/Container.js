/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.learn.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-assign-learn',
    requires: [
        'SparkClassroomTeacher.view.assign.learn.Grid',
        'SparkClassroom.widget.DiscussionList'
    ],

    config: {
        title: 'Learn &amp; Practice',
        items: [
            {
                xtype: 'selectfield',
                cls: 'content-card compact',
                labelAlign: 'left',
                labelWidth: 350,
                width: 650,
                label: 'Number of Learns required for CCSS.ELA.3.CC.4.A',
                options: [
                    { text: 'Between 1-2', value: 1 },
                    { text: 'Between 3-7', value: 1 },
                    { text: 'Between 8-12', value: 1 }
                ]
            },
            {
                xtype: 'container',
                margin: '0 -24', // flush with viewport
                layout: 'auto',
                items: [
                    {
                        xtype: 'spark-assign-learn-grid'
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
        ]
    }
});
