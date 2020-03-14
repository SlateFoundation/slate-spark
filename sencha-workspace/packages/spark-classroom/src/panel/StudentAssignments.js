Ext.define('SparkClassroom.panel.StudentAssignments', {
    extend: 'Ext.Panel',
    xtype: 'spark-studentassignmentspanel',
    requires: [
        'Ext.grid.Grid',
        'SparkClassroom.column.Assignments'
    ],

    manageBorders: false, // manageBorders adds a class that leaks down to the grid and hides the bottom border on its header

    config: {
        flags: null,
        showStatus: false,

        cls: 'spark-teacher-assign-popup',
        floating: true,
        height: 400,
        width: 560,
        margin: 0,
        layout: 'fit',
        items: [
            {
                xtype: 'grid',
                titleBar: null,
                loadingText: null,
                margin: 0,
                store: {
                    fields: [
                        'student',
                        'studentSparkpoint',
                        'assignments',
                        'launched',
                        'completed'
                    ],
                    trackRemoved: false
                },
                columns: [
                    {
                        dataIndex: 'student',
                        text: 'Name',
                        flex: 1,
                        sortable: false, // TODO: properly configure sorting
                        tpl: ['<tpl for="student.getData()">{FullName}</tpl>']
                    },
                    {
                        dataIndex: 'studentSparkpoint',
                        text: 'Current Sparkpoint',
                        flex: 1,
                        sortable: false, // TODO: properly configure sorting
                        tpl: [
                            '<tpl if="studentSparkpoint">',
                                '<tpl for="studentSparkpoint.getData()">',
                                    '{sparkpoint}',
                                '</tpl>',
                            '</tpl>'
                        ]
                    },
                    {
                        text: 'Status',
                        xtype: 'spark-completed-column',
                        width: 70,
                        sortable: false,
                        allowToggle: false,
                        hidden: true
                    },
                    {
                        xtype: 'spark-column-assignments',
                        showTrigger: false
                    }
                ]
            }
        ]
    },

    updateFlags: function(flags) {
        this.down('spark-column-assignments').setFlags(flags);
    },

    updateShowStatus: function(showStatus) {
        this.down('spark-completed-column').setHidden(!showStatus);
    },

    getGrid: function() {
        var me = this;
        return me.grid || (me.grid = me.down('grid'));
    }
});