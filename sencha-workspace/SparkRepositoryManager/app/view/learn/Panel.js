Ext.define('SparkRepositoryManager.view.learn.Panel', {
    extend: 'Ext.grid.Panel',
    xtype: 's2m-learn-panel',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.grid.column.Date',
        'Ext.grid.plugin.RowEditing',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',

        /* global SparkRepositoryManager */
        'SparkRepositoryManager.proxy.Records',
        'SparkRepositoryManager.Util',
        'SparkRepositoryManager.column.StandardsList'
    ],


    store: 'LearnLinks',

    columnLines: true,

    defaultListenerScope: true,

    referenceHolder: true,

    // TODO: Move to common code
    onSelectionChange: function(sm, selections) {
        this.getReferences().removeButton.setDisabled(selections.length === 0);
        this.getReferences().alignButton.setDisabled(selections.length === 0);
    },

    // TODO: Move to common code
    dockedItems: [
        {
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
            },
            {
                xtype: 'tbseparator'
            },
            {
                reference: 'alignButton',
                text: 'Align to Standards',
                tooltip: 'Align this link to multiple standards easily using the standards picker',
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
                text: 'Delete Learn',
                tooltip: 'Remove the selected learn link',
                action: 'delete',
                disabled: true
            }]
        }
    ],

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
                            SparkRepositoryManager.Util.autoPopulateMetadata(this.up('roweditor'), 'Spark2\\LearnLink');
                        },
                        buffer: 1000
                    }
                },
                validationEvent: false,
                validateOnBlur: false
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
            width: 175,
            text: 'Vendor',
            dataIndex: 'VendorID',

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

            renderer: function(val) {
                var vendorRecord = Ext.getStore('Vendors').getById(val),
                    returnVal = '',
                    logoURL;

                if (vendorRecord) {
                    logoURL = vendorRecord.get('LogoURL');
                    returnVal = logoURL ? '<img src="' + logoURL + '" width="16" height="16"><span style="display: inline-block; top: -3px; left: 4px; position: relative;">' + vendorRecord.get('Name') + '</span>' : vendorRecord.get('Name');
                }

                return returnVal;
            }
        },
        {
            text: 'DOK',
            dataIndex: 'DOK',

            filterField: {
                xtype: 'combobox',
                store: [1, 2, 3, 4],
                editable: false,
                grow: true
            },

            editor: {
                xtype: 'combobox',
                store: [1, 2, 3, 4],
                editable: false,
                grow: true
            }
        },
        {
            text: 'Type',
            dataIndex: 'Type',

            filterField: {
                xtype: 'combobox',
                store: [
                    'Assessment',
                    'Video',
                    'Homework',
                    'Exercise',
                    'Game',
                    'Question'
                ],
                editable: false,
                grow: true
            },

            editor: {
                xtype: 'combobox',
                store: [
                    'Assessment',
                    'Video',
                    'Homework',
                    'Exercise',
                    'Game',
                    'Question'
                ],
                editable: false,
                grow: true
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
                        url: '/spark2/learn-links/*creators'
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

    plugins: [{
        ptype: 'rowediting',
        pluginId: 'rowediting',
        clicksToEdit: 2,
        clicksToMoveEditor: 2,
        autoCancel: false,
        errorSummary: true
    }]
});
