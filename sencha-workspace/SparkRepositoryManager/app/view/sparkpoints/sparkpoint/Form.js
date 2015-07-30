Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'srm-sparkpoints-sparkpointform',

    requires: [
        'Ext.form.field.Checkbox',
        'SparkRepositoryManager.field.LevelSlider'
    ],

    defaults: {
        anchor: '100%'
    },

    items: [{
        xtype: 'textfield',
        fieldLabel: 'Code',
        name: 'code'
    },{
        xtype: 'srm-field-levelslider',
        fieldLabel: 'Target Level Range'
    },{
        xtype: 'checkboxfield',
        fieldLabel: 'Root standard',
        name: 'root',
        inputValue: '1'
    },{
        xtype: 'checkboxfield',
        fieldLabel: 'Power standard',
        name: 'power',
        inputValue: '1'
    },{
        // TODO: Does a text area work here?
        xtype: 'textarea',
        fieldLabel: 'Editor\'s Memo',
        name: 'note'
    }]
});
