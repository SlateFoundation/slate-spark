Ext.define('SparkRepositoryManager.view.assess.Panel', {
    extend: 'Ext.grid.Panel',
    xtype: 's2m-assess-panel',
    requires: [
        'Ext.Array',
        'Ext.XTemplate',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.grid.column.Date',
        'Ext.grid.plugin.RowEditing',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Toolbar',

        /* global SparkRepositoryManager */
        'SparkRepositoryManager.proxy.Records',
        'SparkRepositoryManager.Util',
        'SparkRepositoryManager.column.StandardsList'
    ],


    store: 'Assessments',

    columnLines: true,

    defaultListenerScope: true,

    referenceHolder: true,

    onSelectionChange: function(sm, selections) {
        this.getReferences().removeButton.setDisabled(selections.length === 0);
        this.getReferences().alignButton.setDisabled(selections.length === 0);
    },

    dockedItems: [
        {
            xtype: 'pagingtoolbar',
            store: 'Assessments',
            dock: 'bottom',
            displayInfo: true
        },
        {
            xtype: 'toolbar',
            items: [{
                text: 'Add Assessment',
                tooltip: 'Add a new assessment',
                action: 'add'
            },
            {
                xtype: 'tbseparator'
            },
            {
                reference: 'alignButton',
                text: 'Align to Standards',
                tooltip: 'Align this assessment to multiple standards easily using the standards picker',
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
                text: 'Delete Assessment',
                tooltip: 'Remove the selected assessment',
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
            text: 'Type',
            dataIndex: 'AssessmentTypeID',
            flex: 1,

            editor: {
                xtype: 'combobox',
                store: 'AssessmentTypes',
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                grow: true,
                editable: false
            },

            filterField: {
                xtype: 'combobox',
                store: 'AssessmentTypes',
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                grow: true,
                editable: false
            },

            renderer: function(val) {
                var assessmentType = Ext.getStore('AssessmentTypes').getById(val);

                if (assessmentType) {
                    return assessmentType.get('Name');
                }

                return '';
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
                            SparkRepositoryManager.Util.autoPopulateMetadata(this.up('roweditor'), 'Spark2\\Assessment');
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
            text: 'Created By',
            dataIndex: 'CreatorFullName',
            sortable: false,
            filterField: {
                xtype: 'combobox',
                store: {
                    xclass: 'Ext.data.Store',

                    proxy: {
                        type: 'spark-api',
                        url: '/spark2/assessments/*creators'
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
    }]
});
