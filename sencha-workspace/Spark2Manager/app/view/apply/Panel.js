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
        'Ext.layout.container.Fit',
        'Ext.grid.plugin.RowEditing',
        'Ext.toolbar.Paging',
        'Ext.XTemplate',
        'Ext.toolbar.Toolbar',
        'Spark2Manager.Util',
        'Ext.Array',
        'Ext.form.RadioGroup',
        'Ext.form.field.Date'
    ],

    stores: [
        'ApplyProjects'
    ],

    extend: 'Ext.form.Panel',

    xtype:  's2m-apply-panel',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 90,
        anchor:     '100%'
    },

    bodyPadding: 5,

    items: [{
        flex: 2,
        xtype:           'gridpanel',
        modelValidation: false,
        store:           'ApplyProjects',

        dockedItems: [{
            xtype:       'pagingtoolbar',
            store:       'ApplyProjects',
            dock:        'bottom',
            displayInfo: true
        }, {
            xtype:     'toolbar',
            id: 'gridtoolbar',
            items:     [{
                text:    'Add Project',
                tooltip: 'Add a new project',
                action:  'add'
            }, '-', {
                text:      'Align to Standards',
                tooltip:   'Align this link to multiple standards easily using the standards picker',
                action:    'align',
                disabled:  true
            }, '-', {
                text:      'Delete Project',
                tooltip:   'Remove the selected project',
                action:    'delete',
                disabled:  true
            }],
            border: 5,
            style: {
                borderColor: 'red',
                borderStyle: 'solid'
            }
        }],

        columns:         [{
            text:      'Project Title',
            flex:      2,
            sortable:  true,
            dataIndex: 'Title',
            msgTarget: 'under',
            editor:    {
                xtype:      'textfield',
                allowBlank: false
            }
        }, {
            text:      'Instructions',
            flex:      3,
            sortable:  true,
            dataIndex: 'Instructions',
            editor:    {
                xtype:      'textarea',
                allowBlank: false,
                msgTarget:  'under'
            }
        }, {
            text:      'Standards',
            editor:    {
                xtype:        'tagfield',
                displayField: 'standardCode',
                valueField:   'standardCode',
                store:        'StandardCodes',
                multiSelect:  true,
                getModelData: function () {
                    return {
                        'Standards': Ext.Array.map(this.valueStore.collect('standardCode'), function (code) {
                            return {
                                standardCode: code
                            }
                        })
                    };
                },
                listeners:    {
                    'autosize': function () {
                        // HACK: when the tagfield autosizes it pushes the update/cancel roweditor button down
                        this.up('roweditor').getFloatingButtons().setButtonPosition('bottom');
                    }
                }
            },
            renderer:  function (val, col, record) {
                val = record.get('Standards');

                if (!Array.isArray(val)) {
                    return '';
                }

                return val.map(function (standard) {
                    return standard.standardCode || standard;
                }).join(', ');
            },
            dataIndex: 'Standards',
            width: 250
        }, {
            text:      'Grade',
            dataIndex: 'GradeLevel',
            width:     60,
            editor:    {
                xtype:    'combobox',
                store:    ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                editable: false,
                grow:     true
            }
        }, {
            text:      'DOK',
            dataIndex: 'DOK',
            editor:    {
                xtype: 'combobox',
                store: [1, 2, 3, 4]
            },
            width:     50
        }],
        listeners:       {
            selectionchange: function (model, records) {
                var me = this,
                    panel = me.findParentByType('s2m-apply-panel'),
                    form = panel.getForm(),
                    rec = records[0];

                if (rec) {
                    form.loadRecord(rec);
                    me.down('#gridtoolbar button[action="delete"]').setDisabled(records.length === 0);
                    me.down('#gridtoolbar button[action="align"]').setDisabled(records.length === 0);
                }
            }
        },

        plugins: {
            ptype:        'rowediting',
            pluginId:     'rowediting',
            clicksToEdit: 2,
            errorSummary: false
        }
    }, {
        flex: 1,
        margin:      '0 0 0 10',
        reference:   'form',
        items: [{
            xtype:       'fieldset',
            title:       'Project details',
            layout:      'anchor',
            defaultType: 'textfield',
            items:       []
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