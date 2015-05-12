Ext.define('Spark2Manager.view.assess.Panel', {
    requires: [
        'Ext.grid.plugin.RowEditing',
        'Ext.toolbar.Paging',
        'Ext.XTemplate',
        'Ext.toolbar.Toolbar',
        'Ext.Array'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-assess-panel',

    store: 'Assessments',

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
            }, '-', {
                reference: 'alignButton',
                text: 'Align to Standards',
                tooltip: 'Align this assesment to multiple standards easily using the standards picker',
                action: 'align',
                disabled: true
            }, '-', {
                reference: 'removeButton',
                text: 'Delete Assessment',
                tooltip: 'Remove the selected assessment',
                action: 'delete',
                disabled: true
            }]
    }],

    columns: [
        {
            text: 'Standard',
            editor: {
                xtype: 'tagfield',
                displayField: 'standardCode',
                valueField: 'standardCode',
                store: 'StandardCodes',
                forceSelection: true,
                multiSelect: true,
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
                editable: false,
                allowBlank: false
            },
            renderer: function(val, col, record) {
                // HELP: @themightychris: is there an easier way to do this sort of thing?
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
            editor: {
                xtype: 'textfield',
                allowBlank: false,
                listeners: {
                    change: {
                        fn: function () {
                            Spark2Manager.Util.autoPopulateMetadata(this.up('roweditor'), 'Spark2\\Assessment');
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
            }
        }
    ],

    listeners: {
        'selectionchange': 'onSelectionChange'
    },

    selType: 'rowmodel',

    plugins: {
        ptype: 'rowediting',
        pluginId: 'rowediting',
        clicksToEdit: 1,
        clicksToMoveEditor: 1,
        autoCancel: false
    }
});
