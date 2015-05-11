Ext.define('Spark2Manager.view.learn.Panel', {
    requires: [
        'Ext.grid.plugin.RowEditing',
        'Ext.button.Button',
        'Ext.toolbar.Paging',
        'Ext.XTemplate',
        'Ext.grid.filters.Filters',
        'Ext.toolbar.Toolbar'
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

    rowEditing: Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
    }),

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
                tooltip: 'Add a new row',
                action: 'add',
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
            text: 'Standard',
            editor: {
                xtype: 'tagfield',
                displayField: 'standardCode',
                valueField: 'standardCode',
                store: 'StandardCodes',
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
                        var buttons = this.up().getFloatingButtons(),
                            height = this.getHeight();
                        buttons.getEl().setStyle('top', (height + 11) + 'px');
                    },
                    'change': function(tagfield, newValue) {
                        /* HACK: if we don't commit after records are modified here, they'll show up incorrectly in the
                                 align standards window.
                         */
                        this.up().getRecord().set('Standards', newValue);
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
            text: 'URL',
            dataIndex: 'URL',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: false,
                listeners: {
                    blur: function (urlField) {
                        var me = this,
                            record = urlField.up().getRecord(),
                            title = record.get('Title'),
                            url = urlField.value;

                        if (title === '') {
                            var parsedURL = Spark2Manager.Util.parseURL(url),
                            // TODO: we can make a better pattern here for findRecord
                                hostname = parsedURL ? parsedURL.hostname.replace('www.', '') : null;

                            // Automatically select the vendor from the dropdown
                            if (hostname) {
                                var vendorDomain = Ext.getStore('VendorDomains').findRecord('Domain', hostname);
                                // TODO: How do we query by ContextClass = Spark2\LearnLink at the same time
                                if (vendorDomain) {
                                    record.set('VendorID', vendorDomain.data.VendorID);
                                }

                                // Client-side title only
                                Ext.Ajax.request({
                                    method: 'get',

                                    url: 'http://slate.ninja/spark2/proxy.php',

                                    params: {
                                        csurl: url
                                    },

                                    success: function (response) {
                                        var html = document.createElement('div'),
                                            titles,
                                            title,
                                            vendor = (vendorDomain && vendorDomain.data) ? Ext.getStore('Vendors').findRecord('ID', vendorDomain.data.VendorID) : null;

                                        html.innerHTML = response.responseText;
                                        titles = html.querySelectorAll('title');

                                        if (titles && titles.length >= 1) {
                                            title = Spark2Manager.Util.truncateTitle(titles[0].textContent, vendor, hostname);
                                            record.set('Title', title);
                                        }
                                    }
                                });
                            }
                        }
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
                    '       background-repeat: no-repeat;' +
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
                    returnVal = logoURL ? '<img src="' + logoURL + '"><span style="display: inline-block; top: -3px; left: 4px; position: relative;">' + vendorRecord.get('Name') + '</span>': vendorRecord.get('Name');
                }

                return returnVal;
            }
        },
        {
            text: 'DOK',
            dataIndex: 'DOK',
            editor: {
                xtype: 'slider',
                minValue: 1,
                maxValue: 4
            }
        },
    ],

    listeners: {
        'selectionchange': 'onSelectionChange'
    },

    plugins: ['rowediting']
});
