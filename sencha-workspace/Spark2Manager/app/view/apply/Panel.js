Ext.define('Spark2Manager.view.apply.Panel', {
    requires: [
        'Spark2Manager.store.ApplyProjects',
        'Spark2Manager.store.ApplyLinks',
        'Spark2Manager.store.ApplyToDos',
        'Ext.form.Panel',
        'Ext.grid.Panel',
        'Ext.form.FieldSet',
        'Ext.layout.container.Column',
        'Ext.layout.container.Anchor',
        'Ext.grid.plugin.RowEditing',
        'Ext.toolbar.Paging',
        'Ext.XTemplate',
        'Ext.toolbar.Toolbar',
        'Spark2Manager.Util',
        'Ext.Array'
    ],

    stores: [
        'ApplyProjects'
    ],

    extend: 'Ext.form.Panel',

    xtype: 's2m-apply-panel',
    layout: 'column',

    bodyPadding: 5,

    defaults: {
        bodyPadding: 15
    },

    fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 90,
        anchor: '100%'
    },

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'ApplyProjects',
        dock: 'bottom',
        displayInfo: true
    },
        {
            xtype: 'toolbar',
            reference: 'toolbar',
            items: [{
                text: 'Add Project',
                tooltip: 'Add a new project',
                action: 'add'
            }, '-', {
                reference: 'alignButton',
                text: 'Align to Standards',
                tooltip: 'Align this link to multiple standards easily using the standards picker',
                action: 'align',
                disabled: true
            }, '-', {
                reference: 'removeButton',
                text: 'Delete Project',
                tooltip: 'Remove the selected project',
                action: 'delete',
                disabled: true
            }]
        }],


    items: [{
        columnWidth: 0.65,
        xtype: 'gridpanel',
        store: 'ApplyProjects',
        columns: [{
            text: 'Project Title',
            flex: 1,
            sortable: true,
            dataIndex: 'Title',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            text: 'Description',
            width: 75,
            sortable: true,
            dataIndex: 'Description',
            editor: {
                xtype: 'textarea',
                allowBlank: false
            }
        }, {
            text: 'Standards',
            editor: {
                xtype: 'tagfield',
                displayField: 'standardCode',
                valueField: 'standardCode',
                store: 'StandardCodes',
                multiSelect: true,
                getModelData: function () {
                    return {
                        'Standards': Ext.Array.map(this.valueStore.collect('standardCode'), function (code) {
                            return {standardCode: code}
                        })
                    };
                },
                listeners: {
                    'autosize': function () {
                        // HACK: when the tagfield autosizes it pushes the update/cancel roweditor button down
                        this.up('roweditor').getFloatingButtons().setButtonPosition('bottom');
                    }
                }
            },
            renderer: function (val, col, record) {
                val = record.get('Standards');

                if (!Array.isArray(val)) {
                    return '';
                }

                return val.map(function (standard) {
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
                text: 'DOK',
                dataIndex: 'DOK',
                editor: {
                    xtype: 'combobox',
                    store: [1,2,3,4]
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
            selectionchange: function (model, records) {
                var me = this.getView().up().up();

                var rec = records[0];

                if (rec) {
                    // TODO: @themightychris how can we get the scope of the assign panel better?
                    me.getForm().loadRecord(rec);
                    // me.getReferences().removeButton.setDisabled(selections.length === 0);
                    // me.getReferences().alignButton.setDisabled(selections.length === 0);
                }
            }
        },

        plugins: {
            ptype: 'rowediting',
            pluginId: 'rowediting',
            clicksToEdit: 2
        }
    }, {
        columnWidth: 0.30,
        margin: '0 0 0 10',
        reference: 'form',
        xtype: 'fieldset',
        title: 'Project details',
        layout: 'anchor',
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'Name',
            name: 'name'
        }, {
            fieldLabel: 'Price',
            name: 'price'
        }, {
            fieldLabel: '% Change',
            name: 'pctChange'
        }, {
            xtype: 'datefield',
            fieldLabel: 'Last Updated',
            name: 'lastChange'
        }, {
            xtype: 'radiogroup',
            fieldLabel: 'Rating',
            columns: 3,
            defaults: {
                name: 'rating' //Each radio has the same name so the browser will make sure only one is checked at once
            },
            items: [{
                inputValue: '0',
                boxLabel: 'A'
            }, {
                inputValue: '1',
                boxLabel: 'B'
            }, {
                inputValue: '2',
                boxLabel: 'C'
            }]
        }]
    }],

    changeRenderer: function (val) {
        if (val > 0) {
            return '<span style="color:green;">' + val + '</span>';
        } else if (val < 0) {
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    },

    pctChangeRenderer: function (val) {
        if (val > 0) {
            return '<span style="color:green;">' + val + '%</span>';
        } else if (val < 0) {
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    },

    renderRating: function (val) {
        switch (val) {
            case 0:
                return 'A';
            case 1:
                return 'B';
            case 2:
                return 'C';
        }
    }
});
