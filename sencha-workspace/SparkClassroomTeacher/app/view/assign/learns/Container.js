Ext.define('SparkClassroomTeacher.view.assign.learns.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-assign-learns',
    requires: [
        'Ext.field.Number',
        'SparkClassroom.widget.DiscussionList',
        'SparkClassroomTeacher.view.assign.learns.Grid',
        'SparkClassroomTeacher.view.assign.learns.LearnsRequiredField'
    ],


    config: {
        title: 'Learn &amp; Practice',
        margin: '0 -24', // flush with viewport
        defaultType: 'spark-teacher-assign-learns-grid',
        items: [
            {
                docked: 'top',

                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'spark-teacher-assign-learns-learnsrequiredfield',
                        cls: 'content-card compact'
                    }
                ]
            },
            {
                docked: 'right',

                xtype: 'spark-panel',
                cls: 'dark narrow',
                title: 'Discussion',
                width: 288,
                hidden: !location.search.match(/\WenableAlpha(\W|$)/),
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