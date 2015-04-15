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

    store: 'Links',

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
            text: 'Link',
            dataIndex: 'Link',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        },
        {
            text: 'Vendor',
            dataIndex: 'Vendor',
            editor: {
                xtype: 'combobox',
                store: ['Illuminate']
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
        {
            text: 'Notes',
            flex: 1,
            dataIndex: 'Notes',
            editor: {
                xtype: 'textarea',
                allowBlank: false
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
