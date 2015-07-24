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
        store: [ 7,8,9,10,11,12 ],
        fieldLabel: 'Grade'
    },{
        xtype: 'textfield',
        name: 'dummy',
        fieldLabel: 'some text'
    },{
        xtype: 'textfield',
        name: 'dummy',
        fieldLabel: 'some text'
    }]
});