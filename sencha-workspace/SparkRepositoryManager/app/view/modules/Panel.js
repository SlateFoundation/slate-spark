Ext.define('SparkRepositoryManager.view.units.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'SparkRepositoryManager.view.units.Navigator',
        'SparkRepositoryManager.view.units.editor.Editor'
    ],
    xtype: 's2m-units-panel',

    layout: 'border',

    items: [
        {
            region: 'west',
            xtype: 's2m-units-navigator',
            width: 320
        },
        {
            region: 'center',
            xtype: 's2m-units-editor'
        }
    ]
});