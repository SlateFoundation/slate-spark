Ext.define('SparkRepositoryManager.view.apply.Panel', {

    extend: 'Ext.form.Panel',

    requires: [
        'Ext.data.Store',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.column.Date',
        'Ext.grid.plugin.RowEditing',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.saki.grid.MultiSearch',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Toolbar',
        'Ext.util.Format',
        'Ext.window.MessageBox',
        'SparkRepositoryManager.proxy.Records',
        'SparkRepositoryManager.store.ApplyProjects',
        'SparkRepositoryManager.view.apply.Editor',
        'SparkRepositoryManager.widget.StandardField'
    ],

    xtype: 's2m-apply-panel',

    stores: [
        'ApplyProjects'
    ],

    layout: {
        type:  'hbox',
        align: 'stretch'
    },

    items: [{
        id: 's2m-apply-gridpanel',
        flex: 3,
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
            xtype: 'toolbar',
            id:    'gridtoolbar',
            items: [{
                text:    'Add Apply',
                tooltip: 'Add a new apply',
                action:  'add'
            }, '-', {
                text:     'Align to Standards',
                tooltip:  'Align this link to multiple standards easily using the standards picker',
                action:   'align',
                disabled: true
            }, '-', {
                text:     'Delete Apply',
                tooltip:  'Remove the selected apply',
                action:   'delete',
                disabled: true
            }]
        }],

        columns: [{
            text:      'Apply Title',
            flex:      2,
            sortable:  true,
            dataIndex: 'Title',
            filterField: true,
            msgTarget: 'under',
            editor:    {
                xtype:      'textfield',
                allowBlank: false
            }
        }, {
            // TODO: Move to common code
            text:      'Standards',
            dataIndex: 'Standards',
            width:     275,

            filterField: {
                xtype: 'standardfield',
                displayField: 'standardCode',
                valueField: 'standardCode',
                store: 'StandardCodes'
            },

            editor: {
                xtype: 'standardfield',
                displayField: 'standardCode',
                valueField: 'standardCode',
                store: 'StandardCodes'
            },

            renderer: function (val, col, record) {
                val = record.get('Standards');

                if (!Array.isArray(val)) {
                    return '';
                }

                return val.map(function (standard) {
                    return standard.standardCode || standard;
                }).join(', ');
            }
        }, {
            text:      'Grade',
            dataIndex: 'GradeLevel',
            width:     60,

            filterField: {
                xtype:    'combobox',
                store:    ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                editable: false,
                grow:     true
            },

            editor: {
                xtype:    'combobox',
                store:    ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                editable: false,
                grow:     true
            }
        }, {
            text:      'DOK',
            dataIndex: 'DOK',

            filterField: {
                xtype:    'combobox',
                store:    [1, 2, 3, 4],
                editable: false,
                grow:     true
            },

            editor: {
                xtype:    'combobox',
                store:    [1, 2, 3, 4],
                editable: false,
                grow:     true
            }
        }, {
            text:        'Created By',
            dataIndex:   'CreatorFullName',
            filterField: {
                xtype:        'combobox',
                store:        {
                    xclass: 'Ext.data.Store',

                    proxy: {
                        type: 'spark-records',
                        url: '/spark2/apply-projects/creators',
                        extraParams: {
                            limit: 1024
                        }
                    },

                    fields: ['CreatorID', 'CreatorFullName']
                },
                queryMode:    'local',
                displayField: 'CreatorFullName',
                valueField:   'CreatorID',
                editable:     false,
                grow:         true
            }
        }, {
            xtype:     'datecolumn',
            format:    'm-d-Y',
            text:      'Created',
            dataIndex: 'Created',

            filterField: {
                xtype:  'datefield',
                format: 'm-d-Y'
            }
        }],

        listeners: {
            selectionchange: function (model, records) {
                var me              = this,
                    editor          = Ext.getCmp('s2m-apply-editor'),
                    rec             = records ? records[0] : null,
                    hasRecords      = records.length === 0,
                    rowediting      = me.getPlugin('rowediting'),
                    isEditing = rec && rowediting.editing;

                me.down('#gridtoolbar button[action="delete"]').setDisabled(hasRecords);
                me.down('#gridtoolbar button[action="align"]').setDisabled(hasRecords);
                editor.setDisabled(hasRecords);

                if (isEditing && me.editingPlugin.editor.getForm().isDirty()) {
                    Ext.Msg.confirm(
                        'Unsaved Changes',
                        'Discard any unsaved changes on current apply?',
                        function(response) {
                            if (response === 'yes') {
                                rowediting.cancelEdit();
                                editor.setRecord(rec);
                                editor.setReadOnly(!rowediting.editing);
                                rowediting.startEdit(rec);
                            }
                    });
                } else {
                    editor.setRecord(rec);
                    editor.setReadOnly(!rowediting.editing);
                }
            }
        },

        plugins: [{
            ptype:        'rowediting',
            pluginId:     'rowediting',
            clicksToEdit: 2,
            errorSummary: true,
            autoCancel:   false,
            listeners:    {
                canceledit: function () {
                    var editor = Ext.ComponentQuery.query('s2m-apply-editor')[0];
                    editor.setReadOnly(true);
                },

                beforeedit: function () {
                    var editor = Ext.ComponentQuery.query('s2m-apply-editor')[0];
                    editor.setReadOnly(false);
                },

                edit: function () {
                    var editor = Ext.ComponentQuery.query('s2m-apply-editor')[0];
                    editor.setReadOnly(true);
                }
            }
        }, {
            ptype:    'saki-gms',
            pluginId: 'gms'
        }]
    }, {
        xtype: 's2m-apply-editor',
        dock: 'right',
        margin: 10,
        width: 500,
        id: 's2m-apply-editor',
        readOnly: true,
        disabled: true,
        scrollable: false

    }]
});