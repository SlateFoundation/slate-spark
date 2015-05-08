Ext.define('Spark2Manager.view.StandardPicker', {
    requires: [
        'Ext.layout.container.Fit',
        'Ext.tree.Panel',
        'Ext.Array',
        'Ext.window.MessageBox',
        'Ext.form.field.Tag',
        'Spark2Manager.store.StandardCodes',

        'Spark2Manager.controller.StandardPicker'
    ],

    extend: 'Ext.window.Window',
    xtype: 'basic-window',

    controller: 'StandardPicker',

    config: {
        record: null,
        title: 'Align Standard'
    },

    height: 600,
    width: 1024,
    autoScroll: true,
    bodyPadding: 10,
    constrain: true,
    closable: true,
    modal: true,

    items: [{
        xtype: 'tagfield',
        fieldLabel: 'Standards Selected',
        reference: 'tagfield',
        displayField: 'code',
        valueField: 'code',
        queryMode: 'local',
        publishes: 'value',
        editable: false,
        grow: true,
        selectOnFocus: false,
        store: 'StandardCodes',
        multiSelect: true,

        listeners: {
            beforedeselect: 'onBeforeTagFieldDeselect',
            select: function(combo, record) {
                console.log('select', record);
            }
        }
    },

    {
        alias: 's2m-standards-picker-panel',
        reference: 'tree',
        displayField: 'name',
        xclass: 'Ext.tree.Panel',
        store: 'StandardsTree',
        rootVisible: false,

        listeners: {
            checkchange: 'onStandardsCheck'
        }
    }],

    bbar: [{
        text: 'Align Standards',
        listeners: {
            click: 'onAlignStandardsClick'
        }
    }],

    listeners: {
        activate: 'onPanelActivate'
    },

    updateRecord: function(record) {
        //
    }
});
