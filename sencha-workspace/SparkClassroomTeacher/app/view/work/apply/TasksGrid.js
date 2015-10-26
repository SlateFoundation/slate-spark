/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.apply.TasksGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-teacher-work-apply-tasksgrid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.store.Tasks'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: false,
        emptyText: 'There are no To Dos for this apply project',
        deferEmptyText: false,

        store: {
            xclass: 'SparkClassroom.store.Tasks'
        },

        columns: [
            {
                xtype: 'spark-completed-column',
                text: null,
                width: 45,
                sortable: false,
                allowToggle: false
            },
            {
                xtype: 'column',
                flex: 1,
                text: 'To Dos',
                dataIndex: 'todo',
                cell: {
                    encodeHtml: false
                },
                renderer: function(v) {
                    var fm = Ext.util.Format;
                    return fm.nl2br(fm.htmlEncode(v));
                },
                sortable: false
            },
            {
                xtype: 'datecolumn',
                text: 'Due Date',
                dataIndex: 'date_due',
                width: 150,
                format: 'l, n/j',
                sortable: false
            }
        ]
    }
});
