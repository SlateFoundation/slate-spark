Ext.define('SparkRepositoryManager.view.conference.Panel', {
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Tag',
        'Ext.form.field.TextArea',
        'Ext.grid.column.Date',
        'Ext.grid.plugin.RowEditing',
        'Ext.saki.grid.MultiSearch',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'SparkRepositoryManager.proxy.Records',
        'SparkRepositoryManager.widget.StandardField'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-conference-panel',

    store: 'GuidingQuestions',

    columnLines: true,

    defaultListenerScope: true,

    // This view acts as a reference holder for all components below it which have a reference config
    // For example the onSelectionChange listener accesses a button using its reference
    referenceHolder: true,

    onSelectionChange: function(sm, selections) {
        this.getReferences().removeButton.setDisabled(selections.length === 0);
        this.getReferences().alignButton.setDisabled(selections.length === 0);
    },

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'GuidingQuestions',
        dock: 'bottom',
        displayInfo: true
    },
        {
            xtype: 'toolbar',
            items: [{
                text: 'Add Guiding Question',
                tooltip: 'Add a new guiding question',
                action: 'add'
            }, '-', {
                reference: 'alignButton',
                text: 'Align to Standards',
                tooltip: 'Align this guiding question to multiple standards easily using the standards picker',
                action: 'align',
                disabled: true
            }, '-', {
                reference: 'removeButton',
                text: 'Delete Guiding Question',
                tooltip: 'Remove the selected guiding question',
                action: 'delete',
                disabled: true
            }]
        }],

    columns: [
        {
            // TODO: Move to common code
            text: 'Standards',
            dataIndex: 'Standards',
            width: 275,
            filterField: {
                xtype: 'spark-standardfield'
            },

            editor: {
                xtype: 'spark-standardfield'
            },

            renderer: function(val, col, record) {
                val = record.get('Standards');

                if (!Array.isArray(val)) {
                    return '';
                }

                return val.map(function(standard) {
                    return standard.standardCode || standard;
                }).join(', ');
            }
        },
        {
            text: 'Grade',
            dataIndex: 'GradeLevel',
            width: 75,

            editor: {
                xtype: 'combobox',
                store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                editable: false,
                grow: true
            },

            filterField : {
                xtype: 'combobox',
                store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                editable: false,
                grow: true
            }
        },
        {
            text: 'Question',
            dataIndex: 'Question',
            flex: 1,
            filterField: true,

            editor: {
                xtype: 'textarea',
                allowBlank: false
            }
        },
        {
            text: 'Created By',
            dataIndex: 'CreatorFullName',
            filterField: {
                xtype: 'combobox',
                store: {
                    xclass: 'Ext.data.Store',

                    proxy: {
                        type: 'spark-records',
                        url: '/spark2/guiding-questions/creators',
                        extraParams: {
                            limit: 1024
                        }
                    },

                    fields: ['CreatorID', 'CreatorFullName']
                },
                queryMode: 'local',
                displayField: 'CreatorFullName',
                valueField: 'CreatorID',
                editable: false,
                grow: true
            }
        },
        {
            xtype: 'datecolumn',
            format:'m-d-Y',
            text: 'Created',
            dataIndex: 'Created',

            filterField: {
                xtype: 'datefield',
                format: 'm-d-Y'
            }
        }
    ],

    listeners: {
        'selectionchange': 'onSelectionChange'
    },

    plugins: [{
        ptype: 'rowediting',
        pluginId: 'rowediting',
        clicksToEdit: 2,
        clicksToMoveEditor: 2,
        autoCancel: false,
        errorSummary: true
    }, {
        ptype: 'saki-gms',
        pluginId: 'gms'
    }]
});
