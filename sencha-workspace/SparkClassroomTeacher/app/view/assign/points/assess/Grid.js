/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.assess.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-assess',

    config: {
        title: 'Assess',
        height: 500,
        titleBar: null,
        columns:[
            {
                dataIndex: 'Standards',
                width: 100,
                text: 'Standards',
                tpl: '{[values.Standards.join(", ")]}'
            },
            {
                dataIndex: 'Grade',
                width: 100,
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
                dataIndex: 'Vendor',
                flex: 1,
                width: 100,
                text: 'Vendor',
                tpl: '<img src="http://placehold.it/25x25">{Vendor}',
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Assign',
                text: 'Assign',
                width: 100,
                tpl: '<input type="checkbox" checked="{Assign}">',
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Issue',
                text: 'Issue',
                width: 100,
                tpl: '<img src="http://placehold.it/25x25">',
                cell: {
                    encodeHtml: false
                }
            }
        ],

        store: 'assign.Assess'
    }
});
