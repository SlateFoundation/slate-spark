/**
 * A form for adding Conference question from within the Modules interface
 */
Ext.define('SparkRepositoryManager.view.modules.editor.QuestionForm', {
    extend: 'Ext.window.Window',
    xtype: 's2m-modules-editor-questionform',

    componentCls: 's2m-modules-editor',

    title: 'Add Conference Question',

    modal: true,
    layout: 'fit',
    closeAction: 'hide',    // This window/form will be reused
    closable: false,        // Do not display the 'close' tool button

    items: [{
        xtype: 'form',
        items: [{
            fieldLabel: 'Grade',
            name: 'GradeLevel',
            xtype: 'combobox',
            store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            editable: false,
            grow: true
        }, {
            fieldLabel: 'Question',
            name: 'Question',
            xtype: 'textarea',
            allowBlank: false
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

