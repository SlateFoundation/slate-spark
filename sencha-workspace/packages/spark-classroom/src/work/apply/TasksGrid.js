/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.apply.TasksGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-apply-tasksgrid',
    requires: [
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.store.Tasks',
        'SparkClassroom.column.Completed',
        'SparkClassroom.column.ToDo'
    ],

    config: {
        allowToggleComplete: false,

        plugins: [
            'gridheight'
        ],
        titleBar: false,
        emptyText: 'There are no To Dos for this apply project',
        deferEmptyText: false,

        store: 'work.ApplyTasks',

        columns: [
            {
                xtype: 'spark-completed-column',
                text: null,
                width: 45,
                sortable: false,
                allowToggle: false
            },
            {
                xtype: 'spark-column-todo',
                flex: 1,
                sortable: false
            },
            {
                xtype: 'datecolumn',
                text: 'Due Date',
                dataIndex: 'due_date',
                width: 150,
                format: 'l, n/j',
                sortable: false
            }
        ]
    },

    updateAllowToggleComplete: function(allowToggleComplete) {
        var columns = this.getColumns(),
            columnsLen = columns.length,
            i = 0, column;

        for (; i < columnsLen; i++) {
            column = columns[i];
            if (column.isXType('spark-completed-column')) {
                column.setAllowToggle(allowToggleComplete);
                break;
            }
        }
    }
});
