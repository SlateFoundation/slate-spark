/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.conference.QuestionGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-conference-questiongrid',

    config: {
        title: 'Conference Questions',
        height: 500,
        titleBar: null,
        columns:[
            {
                dataIndex: 'Standards',
                width: 100,
                text: 'Standards',
                tpl: '{[values.Standards ? values.Standards.join(", ") : ""]}'
            },
            {
                dataIndex: 'Grade',
                width: 50,
                text: 'Grade'
            },
            {
                dataIndex: 'Question',
                width: 150,
                text: 'Guiding Questions'
            },
            {
                dataIndex: 'Created',
                text: 'Created',
                width: 100
            },
            {
                dataIndex: 'CreatedBy',
                text: 'Created By',
                width: 100
            },
            {
                dataIndex: 'Assign',
                text: 'Assign',
                width: 100,
                tpl: '<input type="checkbox" checked="Assign"><span class="select-jawn"></span>',
                cell: {
                    encodeHtml: false
                }
            }
        ],

        store: 'assign.Questions'
    }
});