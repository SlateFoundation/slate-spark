Ext.define('Spark2Manager.view.learn.Panel', {
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.selection.CellModel',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.slider.Single',
        'Ext.form.field.ComboBox',
        'Ext.button.Button',
        'Ext.form.field.Tag',
        'Ext.toolbar.Paging'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-learn-panel',

    store: 'LearnLinks',

    bbar: [
        { xtype: 'button', text: 'Add Learn', action: 'create-link' }
    ],

    columns: [
        /*
        HELP: @themightychris how could we chain these together to limit the standards by the subject selected here?
        HELP: @themightychris how could we link this field's default value to a filter elsewhere on the page?
        {
            text: 'Subject',
            flex: 1,
            dataIndex: 'subject',
            editor: {
                reference: 'subjects',
                xtype: 'combobox',
                store: [ 'English', 'Math', 'Social Studies', 'Science' ]
            }
        },
        */
        {
            text: 'Standard',
            width: 250,
            dataIndex: 'code',
            editor: {
                reference: 'standards',
                xtype: 'tagfield',
                store: 'StandardCodes',
                queryMode: 'local',
                displayField: 'code',
                valueField: 'code',
                allowBlank: false,
                filterPickList: true,
                multiSelect: true
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
                var vendorRecord = Ext.getStore('Vendors').getById(val);
                return vendorRecord ? vendorRecord.get('Name') : '';
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
