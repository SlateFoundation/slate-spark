Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'srm-sparkpoints-sparkpointform',

    requires: [
        'Ext.form.field.Checkbox',
        'SparkRepositoryManager.field.LevelSlider'
    ],

    items: [{
        xtype: 'textfield',
        name: 'Title',
        fieldLabel: 'Title',
        emptyText: 'Count really huge numbers'
    },{
        xtype: 'combobox',
        forceSelection: true,
        editable: false,
        triggerAction: 'all',
        store: [ 'K-2', '3-4', '5-6', '7-8', '9-12' ],
        emptyText:'K-2',
        fieldLabel: 'Target Level Range'
    },{
        xtype: 'srm-field-levelslider',
        fieldLabel: 'Target Level Range',
        width: 320
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
        xtype: 'textfield',
        name: 'dummy',
        emptyText: 'New Jersey',
        fieldLabel: 'Jurisdiction'
    },{
        xtype: 'textfield',
        name: 'dummy',
        emptyText: 'Like a boat!',
        fieldLabel: 'Anchor'
    }]
});
