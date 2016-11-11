/**
 * A form for adding conference applys from within the Modules interface
 */
Ext.define('SparkRepositoryManager.view.modules.editor.ApplyForm', {
    extend: 'Ext.window.Window',
    xtype: 's2m-modules-editor-applyform',
    requires: [
        'SparkRepositoryManager.widget.DurationField'
    ],

    componentCls: 's2m-modules-editor',

    title: 'Add Apply',

    modal: true,
    layout: 'fit',
    closeAction: 'hide',    // This window/form will be reused
    closable: false,        // Do not display the 'close' tool button

    items: [{
        xtype: 'form',
        items: [{
            fieldLabel: 'Title',
            name: 'Title',
            xtype: 'textfield',
            allowBlank: false
        }, {
            fieldLabel: 'Grade',
            name: 'GradeLevel',
            xtype: 'combobox',
            store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            editable: false,
            grow: true
        }, {
            fieldLabel: 'DOK',
            name: 'DOK',
            xtype: 'combobox',
            store: [1, 2, 3, 4],
            editable: false,
            grow: true
        }, {
            fieldLabel: 'Directions',
            name: 'Directions',
            xtype: 'textarea',
            allowBlank: false
        }, {
            xtype: 'durationfield',
            itemId: 'timeestimate-durationfield',
            fieldLabel: 'Time Estimate',
            labelAlign: 'top',
            duration: 0,
            anchor: '100%'
        }]
    }],

    buttons: [{
        text: 'Save',
        action: 'save'
    }, {
        text: 'Cancel',
        handler: function(button) {
            button.up('window').close();
        }
    }]

});

