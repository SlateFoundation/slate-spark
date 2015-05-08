Ext.define('Spark2Manager.view.learn.Panel', {
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.button.Button',
        'Ext.toolbar.Paging',
        'Ext.XTemplate'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-learn-panel',

    store: 'LearnLinks',

    bbar: [
        { xtype: 'button', text: 'Add Learn', action: 'create-link' }
    ],

    columns: [
        {
            xtype: 'widgetcolumn',
            width: 90,
            widget: {
                xtype: 'button',
                text: 'Align',
                action: 'align'
            }
        },
        {
            text: 'Standard',
            renderer: function(val, col, record) {
                val = record.get('Standards');

                if (!Array.isArray(val)) {
                    return '';
                }

                return val.map(function(standard) {
                    return standard.standardCode;
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
                allowBlank: false
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
            text: 'Vendor',
            dataIndex: 'VendorID',
            editor: {
                xtype: 'combobox',
                store: 'Vendors',
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                /* TODO: @themightychris I don't know how Sencha Cmd builds SASS yet, can we take a look at this? */
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
                    returnVal = logoURL ? '<img src="' + logoURL + '">' : vendorRecord.get('Name');
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
        }
    ],

    selModel: 'cellmodel',

    plugins: {
        ptype: 'cellediting',
        pluginId: 'cellediting',
        clicksToEdit: 1
    },

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'LearnLinks',
        dock: 'bottom',
        displayInfo: true
    }]
});
