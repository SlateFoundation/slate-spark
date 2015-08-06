Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'srm-sparkpoints-sparkpointform',
    requires: [
        'Ext.form.CheckboxGroup',
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.form.field.Checkbox',
        'SparkRepositoryManager.field.LevelSlider'
    ],


    trackResetOnLoad: true,

    defaults: {
        anchor: '100%'
    },

    items: [{
        xtype: 'textfield',
        fieldLabel: 'Code',
        name: 'code',
        allowBlank: false
    },{
        xtype: 'srm-field-levelslider',
        fieldLabel: 'Target Level Range'
    },{
        xtype: 'checkboxgroup',
        items: [{
        //     boxLabel: 'Anchor',
        //     name: 'anchor',
        //     inputValue: true
        // },{
            boxLabel: 'Power',
            name: 'power',
            inputValue: true
        }]
    },{
        xtype: 'fieldset',
        title: 'For teachers',
        defaults: {
            anchor: '100%',
            labelAlign: 'top'
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Title',
            name: 'teacher_title',
            allowBlank: false
        },{
            xtype: 'textarea',
            fieldLabel: 'Description',
            name: 'teacher_description'
        }]
    },{
        xtype: 'fieldset',
        title: 'For students',
        defaults: {
            anchor: '100%',
            labelAlign: 'top'
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Title',
            name: 'student_title'
        },{
            xtype: 'textarea',
            fieldLabel: 'Description',
            name: 'student_description'
        }]
    // },{
    // TODO: move to own panel below grids?
    //     xtype: 'textarea',
    //     fieldLabel: 'Editor\'s Memo',
    //     labelAlign: 'top',
    //     name: 'memo'
    }],

    dockedItems: [{
        dock: 'bottom',

        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            text: 'Discard changes',
            itemId: 'discard',
            disabled: true
        },{
            xtype: 'button',
            text: 'Save changes',
            itemId: 'save',
            disabled: true
        }]
    }]
});
