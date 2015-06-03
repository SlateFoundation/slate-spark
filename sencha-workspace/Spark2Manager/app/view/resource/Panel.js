Ext.define('Spark2Manager.view.resource.Panel', {
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
        'Ext.toolbar.Toolbar',
        'Spark2Manager.Util',
        'Spark2Manager.widget.StandardField'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-resource-panel',

    store: 'TeacherResources',

    columnLines: true,

    defaultListenerScope: true,

    referenceHolder: true,

    onSelectionChange: function(sm, selections) {
        this.getReferences().removeButton.setDisabled(selections.length === 0);
        this.getReferences().alignButton.setDisabled(selections.length === 0);
    },

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'TeacherResources',
        dock: 'bottom',
        displayInfo: true
    },
                  {
                      xtype: 'toolbar',
                      items: [{
                          text: 'Add Teacher Resource',
                          tooltip: 'Add a new teacher resource',
                          action: 'add'
                      }, '-', {
                          reference: 'alignButton',
                          text: 'Align to Standards',
                          tooltip: 'Align this teacher resource to multiple standards easily using the standards picker',
                          action: 'align',
                          disabled: true
                      }, '-', {
                          reference: 'removeButton',
                          text: 'Delete Teacher Resource',
                          tooltip: 'Remove the teacher resource',
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
            filterField: true,

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

                            Spark2Manager.Util.getMetadata(me.getValue(), false, function(response) {
                                try {
                                    response = JSON.parse(response.responseText);

                                    if (!response.error) {
                                        form.setValues({
                                            'Title': response.title
                                        })
                                    } else {
                                        error = response.error;
                                    }
                                } catch(e) {
                                    error = e;
                                }

                                if (error) {
                                    Ext.Msg.alert(
                                        'Error Accessing Teacher Resource',
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
            filterField: {
                xtype: 'combobox',
                store: Ext.data.JsonStore({
                    // store configs
                    storeId: 'AssessmentCreators',

                    proxy: {
                        type: 'ajax',
                        // TODO: Remove the URL hack below before production
                        url: ((location.hostname === 'localhost') ? 'http://slate.ninja' : '') + '/spark2/teacher-resources/creators',
                        reader: {
                            type: 'json',
                            rootProperty: 'data'
                        },
                        extraParams: {
                            limit: 1024
                        }
                    },

                    fields: ['CreatorID', 'CreatorFullName']
                }),
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
