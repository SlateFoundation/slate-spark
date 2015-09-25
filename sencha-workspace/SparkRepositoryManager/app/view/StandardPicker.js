Ext.define('SparkRepositoryManager.view.StandardPicker', {
    requires: [
        'Ext.Array',
        'Ext.form.field.Tag',
        'Ext.layout.container.Fit',
        'Ext.tree.Panel',
        'SparkRepositoryManager.controller.StandardPicker',
        'SparkRepositoryManager.widget.StandardField',
        'SparkRepositoryManager.store.StandardsTree'
    ],

    extend: 'Ext.window.Window',
    xtype: 'spark-standardpicker',

    controller: 'StandardPicker',

    config: {
        standards: [],
        record: null,
        title: 'Align Standard'
    },

    height: 600,
    width: 1024,
    bodyPadding: 10,
    constrain: true,
    closable: true,
    modal: true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            reference: 'tagfield',
            xtype: 'spark-standardfield',
            fieldLabel: 'Standards Selected',
            grow: true,
            stacked: false,

            listeners: {
                beforeSelect: 'onBeforeTagFieldSelect',
                beforedeselect: 'onBeforeTagFieldDeselect',
                // HACK: beforedeselect doesn't fire unless the tagfield has focus, this makes removing tag items work
                // reliably
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
            reference: 'tree',
            flex: 1,

            xtype: 'treepanel',
            displayField: 'name',
            store: 'StandardsTree',
            rootVisible: false,

            listeners: {
                checkchange: 'onStandardsCheck'
            }
        }
    ],

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
