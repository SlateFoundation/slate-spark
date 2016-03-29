Ext.define('SparkClassroom.assign.Popup', {
    extend: 'Ext.Panel',
    xtype: 'spark-assign-popup',
    requires: [
        'Ext.grid.Grid',
        'Jarvus.plugin.GridFlex'
    ],
    uses: [
        'SparkClassroom.column.Assignments'
    ],

    manageBorders: false, // manageBorders adds a class that leaks down to the grid and hides the bottom border on its header

    config: {
        flags: null,

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
                        'assignments'
                    ],
                    trackRemoved: false
                },
                plugins: [
                    'gridflex'
                ],
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

    getGrid: function() {
        var me = this;
        return me.grid || (me.grid = me.down('grid'));
    }
});