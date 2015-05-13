Ext.define('Spark2Manager.view.apply.Panel', {

    extend: 'Ext.form.Panel',

    requires: [,
        'Spark2Manager.store.ApplyProjects',
        'Spark2Manager.view.apply.Editor',
        'Ext.grid.Panel',
        'Ext.grid.plugin.RowEditing',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Toolbar',
        'Ext.layout.container.HBox',
        'Ext.grid.Panel',
        'Ext.container.Container',
        'Ext.util.Format',
        'Ext.Array',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.Fit',
        'Ext.data.ArrayStore',
        'Ext.ComponentQuery'
    ],

    xtype: 's2m-apply-panel',

    stores: [
        'ApplyProjects'
    ],

    layout: {
        type:  'fit',
        align: 'stretch'
    },

    items: [{
        xtype:           'gridpanel',
        modelValidation: false,
        store:           'ApplyProjects',

        dockedItems: [{
            id:          'pagingtoolbar',
            xtype:       'pagingtoolbar',
            store:       'ApplyProjects',
            dock:        'bottom',
            displayInfo: true
        }, {
            xtype: 'container',

            id: 'editorcontainer',

            dock:    'right',

            scrollable: true,

            items: [{
                xtype: 'toolbar',
                id:    'gridtoolbar',
                items: [{
                    text:    'Add Project',
                    tooltip: 'Add a new project',
                    action:  'add'
                }, '-', {
                    text:     'Align to Standards',
                    tooltip:  'Align this link to multiple standards easily using the standards picker',
                    action:   'align',
                    disabled: true
                }, '-', {
                    text:     'Delete Project',
                    tooltip:  'Remove the selected project',
                    action:   'delete',
                    disabled: true
                }]
            }, {
                padding: 10,
                width: 500,
                xtype: 's2m-apply-editor',
                readOnly: true,
                disabled: true
            }]
        }],

        columns:   [{
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
            width:     250
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
        }, {
            text: 'Created By',
            dataIndex: 'CreatorFullName'
        }, {
            xtype: 'datecolumn',
            format:'m-d-Y',
            text: 'Created',
            dataIndex: 'Created'
        }],
        listeners: {
            selectionchange: function (model, records) {
                var me = this,
                    panel  = me.findParentByType('s2m-apply-panel'),
                    editorContainer = me.down('#editorcontainer'),
                    editor = me.down('s2m-apply-editor'),
                    pagingToolbar = me.down('pagingtoolbar'),
                    rec = records ? records[0] : null,
                    hasRecords = records.length === 0,
                    rowediting = me.getPlugin('rowediting');

                me.down('#gridtoolbar button[action="delete"]').setDisabled(hasRecords);
                me.down('#gridtoolbar button[action="align"]').setDisabled(hasRecords);
                editor.setDisabled(hasRecords);

                if (rec && rowediting.editing) {
                    if (confirm('Discard any unsaved changes on current project?')) {
                        rowediting.cancelEdit();
                    } else {
                        return;
                    }
                }

                editor.setRecord(rec);
                editor.setReadOnly(!rowediting.editing);
            }
        },

        plugins: {
            ptype:        'rowediting',
            pluginId:     'rowediting',
            clicksToEdit: 2,
            errorSummary: true,
            autoCancel: false,
            listeners: {
                canceledit: function(editor, context, eopts) {
                    var editor = Ext.ComponentQuery.query('s2m-apply-editor')[0];
                    editor.setReadOnly(true);
                },
                beforeedit: function(editor, context, eopts) {
                    var editor = Ext.ComponentQuery.query('s2m-apply-editor')[0];
                    editor.setReadOnly(false);
                }
            }
        }
    }]
});