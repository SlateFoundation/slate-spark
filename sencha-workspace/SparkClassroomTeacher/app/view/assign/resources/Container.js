/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.resources.Container', {
    xtype: 'spark-assign-resources',
    extend: 'Ext.grid.Grid',
    requires: [
        'SparkClassroom.plugin.GridFlex',
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
                dataIndex: 'Link',
                flex: 1,
                text: 'URL',
                tpl: '<a href="{Link}">{Link}</a>',
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Title',
                flex: 2,
                text: 'Title'
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
                tpl: '<input type="checkbox" checked="{Assign}}">',
                cell: {
                    encodeHtml: false
                }
            }
        ],

        store: 'assign.Resources'
    }
});
