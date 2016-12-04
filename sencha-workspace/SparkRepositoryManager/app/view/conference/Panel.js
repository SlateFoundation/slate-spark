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
        'SparkRepositoryManager.column.StandardsList'
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
            },
            {
                xtype: 'tbseparator'
            },
            {
                reference: 'alignButton',
                text: 'Align to Standards',
                tooltip: 'Align this guiding question to multiple standards easily using the standards picker',
                action: 'align',
                hidden: true,
                disabled: true
            },
            {
                xtype: 'tbseparator',
                itemId: 'alignButtonSeparator',
                hidden: true
            },
            {
                reference: 'removeButton',
                text: 'Delete Guiding Question',
                tooltip: 'Remove the selected guiding question',
                action: 'delete',
                disabled: true
            }]
        }],

    columns: [
        {
            xtype: 'srm-standardslistcolumn',
            hidden: true
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

            filterField: {
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
            sortable: false,
            filterField: {
                xtype: 'combobox',
                store: {
                    xclass: 'Ext.data.Store',

                    proxy: {
                        type: 'spark-api',
                        url: '/spark2/guiding-questions/*creators'
                    },

                    fields: ['ID', 'FullName']
                },
                queryMode: 'local',
                displayField: 'FullName',
                valueField: 'ID',
                editable: false,
                grow: true
            }
        },
        {
            xtype: 'datecolumn',
            format: 'm-d-Y',
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
