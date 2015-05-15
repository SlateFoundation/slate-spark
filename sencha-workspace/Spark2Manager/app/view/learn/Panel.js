Ext.define('Spark2Manager.view.learn.Panel', {
    requires: [
        'Ext.grid.plugin.RowEditing',
        'Ext.toolbar.Paging',
        'Ext.XTemplate',
        'Ext.toolbar.Toolbar',
        'Spark2Manager.Util',
        'Ext.Array',
        'Ext.grid.header.Container',
        'Ext.saki.grid.MultiSearch'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-learn-panel',

    store: 'LearnLinks',

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
        store: 'LearnLinks',
        dock: 'bottom',
        displayInfo: true
    },
        {
            xtype: 'toolbar',
            items: [{
                text: 'Add Learn',
                tooltip: 'Add a new learn',
                action: 'add'
            }, '-', {
                reference: 'alignButton',
                text: 'Align to Standards',
                tooltip: 'Align this link to multiple standards easily using the standards picker',
                action: 'align',
                disabled: true
            }, '-', {
                reference: 'removeButton',
                text: 'Delete Learn',
                tooltip: 'Remove the selected learn link',
                action: 'delete',
                disabled: true
            }]
    }],

    columns: [
        {
            text: 'Standards',
            filterField: true,
            editor: {
                xtype: 'tagfield',
                displayField: 'standardCode',
                valueField: 'standardCode',
                store: 'StandardCodes',

                filterPickList: true,
                forceSelection: true,
                selectOnFocus: false,
                multiSelect:  true,
                anyMatch: true,

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
            editor: {
                xtype: 'textfield',
                allowBlank: false,
                listeners: {
                    change: {
                        fn: function () {
                            Spark2Manager.Util.autoPopulateMetadata(this.up('roweditor'), 'Spark2\\LearnLink');
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
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        },
        {
            width: 175,
            text: 'Vendor',
            dataIndex: 'VendorID',
            editor: {
                xtype: 'combobox',
                store: 'Vendors',
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                tpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '   <div class="x-boundlist-item" style="',
                    '       background-position: 5px, 5px;',
                    '       background-image: url({LogoURL});',
                    '       background-repeat: no-repeat;',
                    '       background-size: 16px 16px;',
                    '       padding-left: 25px">',
                    '       {Name}',
                    '   </div>',
                    '</tpl>'
                ),
                editable: false,
                grow: true
            },
            renderer: function(val, col, record) {
                var vendorRecord = Ext.getStore('Vendors').getById(val),
                    returnVal = '',
                    logoURL;

                if (vendorRecord) {
                    logoURL = vendorRecord.get('LogoURL');
                    returnVal = logoURL ? '<img src="' + logoURL + '" width="16" height="16"><span style="display: inline-block; top: -3px; left: 4px; position: relative;">' + vendorRecord.get('Name') + '</span>': vendorRecord.get('Name');
                }

                return returnVal;
            },
            filterField: {
                xtype: 'combobox',
                store: 'Vendors',
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                tpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '   <div class="x-boundlist-item" style="',
                    '       background-position: 5px, 5px;',
                    '       background-image: url({LogoURL});',
                    '       background-repeat: no-repeat;',
                    '       background-size: 16px 16px;',
                    '       padding-left: 25px">',
                    '       {Name}',
                    '   </div>',
                    '</tpl>'
                ),
                editable: false,
                grow: true
            },
            renderer: function(val, col, record) {
                var vendorRecord = Ext.getStore('Vendors').getById(val),
                    returnVal = '',
                    logoURL;

                if (vendorRecord) {
                    logoURL = vendorRecord.get('LogoURL');
                    returnVal = logoURL ? '<img src="' + logoURL + '" width="16" height="16"><span style="display: inline-block; top: -3px; left: 4px; position: relative;">' + vendorRecord.get('Name') + '</span>': vendorRecord.get('Name');
                }

                return returnVal;
            }
        },
        {
            text: 'DOK',
            dataIndex: 'DOK',
            editor: {
                xtype: 'combobox',
                store: [1,2,3,4]
            },
            filterField: {
                xtype: 'combobox',
                store: [1,2,3,4]
            }
        },
        {
            text: 'Created By',
            dataIndex: 'CreatorFullName',
            filterField: true
        },
        {
            xtype: 'datecolumn',
            format:'m-d-Y',
            text: 'Created',
            dataIndex: 'Created'
        }
    ],

    listeners: {
        'selectionchange': 'onSelectionChange',
        afterrender: function () {
            var me = this,
                columnManager = me.getColumnManager(),
                headerCt = columnManager.headerCt;

            headerCt.items.each(function(columnHeader) {
                console.log(columnHeader);
            });
        }
    },

    plugins: [{
        ptype: 'rowediting',
        pluginId: 'rowediting',
        clicksToEdit: 2
    }, {
        ptype: 'saki-gms',
        pluginId: 'gms',
        filterOnEnter: false
    }]
});
