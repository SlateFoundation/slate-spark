Ext.define('Spark2Manager.view.conference.Panel', {
    requires: [
        'Ext.grid.plugin.RowEditing',
        'Ext.form.field.TextArea',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Toolbar',
        'Ext.Array'
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

    rowEditing: Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
    }),

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
            text: 'Standard',
            editor: {
                xtype: 'tagfield',
                displayField: 'standardCode',
                valueField: 'standardCode',
                store: 'StandardCodes',

                filterPickList: true,
                forceSelection: true,
                selectOnFocus: false,
                multiSelect:  true,

                getModelData: function() {
                    return {
                        'Standards':
                            Ext.Array.map(this.valueStore.collect('standardCode'), function(code) {
                                return {standardCode: code}
                            })
                    };
                },

                listeners: {
                    'autosize': function() {
                        /* HACK: when the tagfield autosizes it pushes the update/cancel roweditor buttons down */
                        this.up('roweditor').getFloatingButtons().setButtonPosition('bottom');
                    }
                }
            },
            renderer: function(val, col, record) {
                val = record.get('Standards');

                if (!Array.isArray(val)) {
                    return '';
                }

                return val.map(function(standard) {
                    return standard.standardCode || standard;
                }).join(', ');
            },
            width: 250,
            dataIndex: 'Standards'
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
            }
        },
        {
            text: 'Question',
            dataIndex: 'Question',
            flex: 1,
            editor: {
                xtype: 'textarea',
                allowBlank: false
            }
        },
        {
            text: 'Created By',
            dataIndex: 'CreatorFullName'
        },
        {
            xtype: 'datecolumn',
            format:'m-d-Y',
            text: 'Created',
            dataIndex: 'Created'
        }
    ],

    listeners: {
        'selectionchange': 'onSelectionChange'
    },

    plugins: {
        ptype: 'rowediting',
        pluginId: 'rowediting',
        clicksToEdit: 2
    }
});
