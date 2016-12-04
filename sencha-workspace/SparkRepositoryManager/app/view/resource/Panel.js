/* global SparkRepositoryManager */
Ext.define('SparkRepositoryManager.view.resource.Panel', {
    requires: [
        'Ext.Array',
        'Ext.XTemplate',
        'Ext.data.JsonStore',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.grid.column.Date',
        'Ext.grid.plugin.RowEditing',
        'Ext.saki.grid.MultiSearch',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Toolbar',
        'SparkRepositoryManager.proxy.Records',
        'SparkRepositoryManager.column.StandardsList'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-resource-panel',

    store: 'ConferenceResources',

    columnLines: true,

    defaultListenerScope: true,

    referenceHolder: true,

    onSelectionChange: function(sm, selections) {
        this.getReferences().removeButton.setDisabled(selections.length === 0);
        this.getReferences().alignButton.setDisabled(selections.length === 0);
    },

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'ConferenceResources',
        dock: 'bottom',
        displayInfo: true
    },
    {
        xtype: 'toolbar',
        items: [
            {
                text: 'Add Conference Resource',
                tooltip: 'Add a new Conference Resource',
                action: 'add'
            },
            {
                xtype: 'tbseparator'
            },
            {
                reference: 'alignButton',
                text: 'Align to Standards',
                tooltip: 'Align this Conference Resource to multiple standards easily using the standards picker',
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
                text: 'Delete Conference Resource',
                tooltip: 'Remove the Conference Resource',
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
            text: 'URL',
            dataIndex: 'URL',
            flex: 1,
            filterField: true,

            editor: {
                xtype: 'textfield',
                listeners: {
                    change: {
                        fn: function () {
                            var me = this,
                                form = me.up().getForm(),
                                error;

                            SparkRepositoryManager.API.getMetadata(me.getValue(), false, function(response) {
                                try {
                                    response = JSON.parse(response.responseText);

                                    if (response.error) {
                                        error = response.error;
                                    } else {
                                        form.setValues({
                                            'Title': response.title
                                        })
                                    }
                                } catch (e) {
                                    error = e;
                                }

                                if (error) {
                                    Ext.Msg.alert(
                                        'Error Accessing Conference Resource',
                                        error
                                    );
                                    me.setValue('');
                                }
                            });
                        },
                        buffer: 1000
                    }
                }
            }
        },
        {
            text: 'Title',
            dataIndex: 'Title',
            flex: 1,
            filterField: true,

            editor: {
                xtype: 'textfield'
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
                        url: '/spark2/conference-resources/*creators'
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
        selectionchange: 'onSelectionChange'
    },

    selType: 'rowmodel',

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
