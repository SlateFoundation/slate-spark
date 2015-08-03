/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.conference.ResourceGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-conference-resourcegrid',

    config: {
        title: 'Conference Resources',
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
                dataIndex: 'Link',
                width: 100,
                text: 'Url'
            },
            {
                dataIndex: 'Title',
                width: 100,
                text: 'Title'
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
                tpl: '<input type="checkbox" checked="{Assign}}">',
                cell: {
                    encodeHtml: false
                }
            }
        ],

        store: 'assign.Resources'
    }
});