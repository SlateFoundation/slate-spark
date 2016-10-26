Ext.define('SparkRepositoryManager.view.modules.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'SparkRepositoryManager.view.modules.Navigator',
        'SparkRepositoryManager.view.modules.editor.Editor'
    ],
    xtype: 's2m-modules-panel',

    layout: 'border',

    items: [
        {
            region: 'west',
            xtype: 's2m-modules-navigator',
            width: 320
        },
        {
            region: 'center',
            xtype: 's2m-modules-editor'
        }
    ]
});
