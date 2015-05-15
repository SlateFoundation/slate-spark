Ext.define('Spark2Manager.view.StandardPicker', {
    requires: [
        'Ext.layout.container.Fit',
        'Ext.tree.Panel',
        'Ext.Array',
        'Ext.form.field.Tag',
        'Spark2Manager.controller.StandardPicker'
    ],

    extend: 'Ext.window.Window',
    xtype: 'basic-window',

    controller: 'StandardPicker',

    config: {
        standards: [],
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
        displayField: 'standardCode',
        valueField: 'standardCode',
        queryMode: 'local',
        publishes: 'value',
        filterPickList: true,
        forceSelection: true,
        anyMatch: true,
        grow: true,
        selectOnFocus: false,
        multiSelect: true,

        listeners: {
            beforeSelect: 'onBeforeTagFieldSelect',
            beforedeselect: 'onBeforeTagFieldDeselect',
            // HACK: beforedeselect doesn't fire unless the tagfield has focus, this makes removing tag items work reliably
            render: function(tagfield) {
                tagfield.getEl().on('mouseup', function(ev, el) {
                    var previousSibling;

                    if (el.classList.contains('x-tagfield-item-close')) {
                        previousSibling = Ext.getStore('StandardsTree').findRecord('standardCode', el.previousSibling.textContent);

                        if(previousSibling) {
                            if (typeof previousSibling.get('checked') == 'boolean') {
                                previousSibling.set('checked', false);
                            }
                        }
                    }
                });
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
