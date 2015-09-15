/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.questions.Container', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-questions',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Ext.grid.plugin.PagingToolbar'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridpagingtoolbar'
        ],
        height: 500,
        grouped: true,
        titleBar: null,
        margin: '0 -24', // flush with viewport
        columns:[
            {
                dataIndex: 'Standards',
                width: 288,
                text: 'Standards',
                tpl: '{[values.Standards ? values.Standards.join(", ") : ""]}'
            },
            {
                dataIndex: 'Grade',
                width: 80,
                text: 'Grade'
            },
            {
                dataIndex: 'Question',
                flex: 1,
                text: 'Guiding Questions'
            },
            {
                dataIndex: 'CreatedBy',
                text: 'Created By',
                width: 160
            },
            {
                dataIndex: 'Created',
                text: 'Created',
                width: 96
            },
            {
                dataIndex: 'Assign',
                text: 'Assign',
                width: 96,
                tpl: '<input type="checkbox" checked="Assign"><span class="select-jawn"></span>',
                cell: {
                    encodeHtml: false
                }
            }
        ],

        store: 'assign.Questions'
    }
});
