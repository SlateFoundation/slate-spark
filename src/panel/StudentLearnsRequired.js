Ext.define('SparkClassroom.panel.StudentLearnsRequired', {
    extend: 'Ext.Panel',
    xtype: 'spark-studentlearnsrequiredpanel',
    requires: [
        'Ext.grid.Grid',
        'Ext.app.ViewModel',
        'Jarvus.plugin.GridFlex'
    ],

    manageBorders: false, // manageBorders adds a class that leaks down to the grid and hides the bottom border on its header

    config: {
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
                itemConfig: {
                    viewModel: true
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
                        dataIndex: 'learnsRequired',
                        text: 'Learns Required',
                        width: 100,
                        sortable: false, // TODO: properly configure sorting
                        cell: {
                            xtype: 'widgetcell',
                            widget: {
                                xtype: 'numberfield',
                                bind: {
                                    placeHolder: '{record.learnsRequired.section}'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },

    getGrid: function() {
        var me = this;
        return me.grid || (me.grid = me.down('grid'));
    }
});