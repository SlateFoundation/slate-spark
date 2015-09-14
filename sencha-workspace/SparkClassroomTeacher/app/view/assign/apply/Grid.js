/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.apply.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-apply-grid',
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
        store: 'assign.Apply',
        columns:[
            {
                dataIndex: 'Title',
                flex: 1,
                text: 'Title'
            },
            {
                dataIndex: 'Standards',
                text: 'Standards',
                tpl: '{[values.Standards ? values.Standards.join(", ") : ""]}',
                width: 288
            },
            {
                dataIndex: 'Grade',
                width: 80,
                text: 'Grade'
            },
            {
                dataIndex: 'DOK',
                width: 80,
                text: 'DOK'
            },
            {
                dataIndex: 'CreatedBy',
                width: 128,
                text: 'Created By'
            },
            {
                dataIndex: 'Assign',
                width: 96,
                text: 'Assign',
                tpl: '<input type="checkbox" checked="{Assign}">',
                cell: {
                    encodeHtml: false
                }
            }
        ]
    }
});
