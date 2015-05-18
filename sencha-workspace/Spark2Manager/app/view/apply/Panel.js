Ext.define('Spark2Manager.view.apply.Panel', {

    extend: 'Ext.form.Panel',

    requires: [
        'Ext.Array',
        'Ext.ComponentQuery',
        'Ext.container.Container',
        'Ext.data.ArrayStore',
        'Ext.data.JsonStore',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.Panel',
        'Ext.grid.column.Date',
        'Ext.grid.plugin.RowEditing',
        'Ext.layout.container.Fit',
        'Ext.saki.grid.MultiSearch',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Toolbar',
        'Ext.util.Format',
        'Spark2Manager.store.ApplyProjects',
        'Spark2Manager.view.apply.Editor',
        'Ext.window.MessageBox'
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
        id: 's2m-apply-gridpanel',

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

            dock: 'right',

            scrollable: true,

            items: [{
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
            }, {
                padding:  10,
                width:    500,
                xtype:    's2m-apply-editor',
                id:       's2m-apply-editor',
                readOnly: true,
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
            width:     250,

            filterField: {
                xtype:        'tagfield',
                displayField: 'standardCode',
                valueField:   'standardCode',
                store:        'StandardCodes',

                filterPickList: true,
                forceSelection: true,
                selectOnFocus:  false,
                multiSelect:    true,
                anyMatch:       true,

                listeners: {
                    'autosize': function (tagfield, newHeight) {
                        var me      = this,
                            ownerCt = me.ownerCt;

                        /* HACK: The first time this runs, it will fail due to:
                         https://docs.m.sencha.com/forum/showthread.php?300648-Cannot-read-property-offsetHeight-of-undefined-in-BufferedRenderer-Broken-Ext-5.1&p=1098485&langid=4
                        */

                        if (!me.autosized) {
                            me.autosized = true;
                            return;
                        }

                        if (ownerCt.height != newHeight) {
                            ownerCt.setHeight(newHeight);
                        }
                    }
                }
            },

            editor: {
                xtype:        'tagfield',
                displayField: 'standardCode',
                valueField:   'standardCode',
                store:        'StandardCodes',

                filterPickList: true,
                forceSelection: true,
                selectOnFocus:  false,
                multiSelect:    true,
                anyMatch:       true,

                getModelData: function () {
                    return {
                        'Standards': Ext.Array.map(this.valueStore.collect('standardCode'), function (code) {
                            return {standardCode: code}
                        })
                    };
                },

                listeners: {
                    'autosize': function () {
                        /* HACK: when the tagfield autosizes it pushes the update/cancel roweditor buttons down */
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
                store:        Ext.data.JsonStore({
                    // store configs
                    storeId: 'LearnCreators',

                    proxy: {
                        type:        'ajax',
                        // TODO: Remove the URL hack below before production
                        url:         ((location.hostname === 'localhost') ? 'http://slate.ninja'
                            : '') + '/spark2/apply-projects/creators',
                        reader:      {
                            type:         'json',
                            rootProperty: 'data'
                        },
                        extraParams: {
                            limit: 1024
                        }
                    },

                    fields: ['CreatorID', 'CreatorFullName']
                }),
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
                    panel           = me.findParentByType('s2m-apply-panel'),
                    editor          = me.down('s2m-apply-editor'),
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
    }]
});