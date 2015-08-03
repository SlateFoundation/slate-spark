/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.apply.TaskGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-teacher-work-apply-taskgrid',

    config: {
        height: 200,
        titleBar: false,
        columns: [
            {
                text: 'To Dos',
                width: 400,
                tpl: '<input type="checkbox" checked="{Completed}"> {Title}',
                cell: {
                    encodeHtml: false
                }
            },
            {
                text: 'Due Date',
                width: 100,
                dataIndex: 'DueDate'
            }
        ],
        store: 'apply.Tasks'
    }
});