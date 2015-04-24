/**
 * Created by jmealo on 4/14/15.
 */
Ext.define('Spark2Manager.view.learn.Panel', {
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.selection.CellModel',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.slider.Single',
        'Ext.form.field.ComboBox',
        'Ext.button.Button'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-learn-panel',

    store: 'LearnLink',

    bbar: [
        { xtype: 'button', text: 'Add Learn', action: 'create-link' }
    ],

    columns: [
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
            text: 'URL',
            dataIndex: 'URL',
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
                store: 'Vendor',
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
                /* TODO: @themightychris This doesn't work, also it always displays the value in the grid, not the display */
                displayTpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                        '<img src="{LogoURL}" class="icon"/>{Name}',
                    '</tpl>'
                ),
                editable: false,
                grow: true
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
    }
});
