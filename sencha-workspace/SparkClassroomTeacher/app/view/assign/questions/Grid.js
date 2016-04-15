/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.questions.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-teacher-assign-questions-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.CreatedBy',
        'SparkClassroom.column.CreatedDate',
        'SparkClassroom.column.Assignments'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        store: 'assign.ConferenceQuestions',
        columns:[
            // {
            //     xtype: 'spark-sparkpoints-column'
            // },
            // {
            //     xtype: 'spark-grade-column'
            // },
            {
                flex: 2,
                xtype: 'spark-link-column',
                text: 'Learn',
                cell: {
                    encodeHtml: false,
                    cls: 'spark-cell-nowrap'
                }
            },
            {
                xtype: 'spark-learntype-column'
            },
            {
                xtype: 'spark-dok-column'
            },
            {
                xtype: 'spark-rating-column'
            },
            // {
            //     xtype: 'spark-attachment-column'
            // },
            {
                xtype: 'spark-column-assignments',
                flags: [
                    {
                        id: 'required-first',
                        text: 'Start Here',
                        icon: 'flag-checkered'
                    },
                    {
                        id: 'required',
                        text: 'Required',
                        icon: 'asterisk'
                    },
                    {
                        id: 'recommended',
                        text: 'Recommended',
                        icon: 'thumbs-up'
                    },
                    {
                        id: 'hidden',
                        text: 'Hidden',
                        icon: 'eye-slash'
                    }
                ],
            }
            // TODO: implement flagging
            // {
            //     xtype: 'spark-flag-column'
            // }
        ]
    }
});
