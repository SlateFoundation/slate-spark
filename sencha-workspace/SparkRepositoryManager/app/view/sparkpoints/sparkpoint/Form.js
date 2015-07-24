Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'srm-sparkpoints-sparkpointform',

    items: [{
        xtype: 'textfield',
        name: 'Title',
        fieldLabel: 'Title'
    },{
        xtype: 'combobox',
        forceSelection: true,
        editable: false,
        triggerAction: 'all',
        store: [ 'K-2', '3-4', '5-6', '7-8', '9-12' ],
        fieldLabel: 'Target Level Range'
    },{
        xtype: 'textfield',
        name: 'dummy',
        fieldLabel: 'Jurisdiction'
    },{
        xtype: 'textfield',
        name: 'dummy',
        fieldLabel: 'Anchor'
    }]
});