/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.apply.TaskGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-teacher-work-apply-taskgrid',
    requires: [
        'Jarvus.plugin.GridFlex'
    ],

    config: {
        plugins: [
            'gridflex'
        ],
        height: 200,
        titleBar: null,
        columns: [
            {
                text: 'To Dos',
                flex: 1,
                tpl: '<input type="checkbox" checked="{Completed}"> {Title}',
                cell: {
                    encodeHtml: false
                }
            },
            {
                text: 'Due Date',
                width: 200,
                dataIndex: 'DueDate'
            }
        ],
        store: 'apply.Tasks'
    }
});
