Ext.define('SparkRepositoryManager.view.sparkpoints.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'srm-sparkpoints-panel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.ContentAreasTable',
        'SparkRepositoryManager.view.sparkpoints.TabPanel',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Panel',
        'SparkRepositoryManager.view.sparkpoints.standards.StandardsTable'
    ],

    layout: 'border',

    items: [{
        region: 'south',
        split: true,

        xtype: 'srm-sparkpoints-standardstable',
        height: 300,
        collapsible: true,

        stateful: true,
        stateId: 'srm-sparkpoints-standardstable'
    },{
        region: 'west',
        split: true,

        xtype: 'srm-sparkpoints-contentareastable',
        width: 300,
        collapsible: true,

        stateful: true,
        stateId: 'srm-sparkpoints-contentareastable'
    },{
        region: 'east',
        split: true,

        xtype: 'srm-sparkpoints-sparkpointspanel',
        width: 300,
        collapsible: true,

        stateful: true,
        stateId: 'srm-sparkpoints-sparkpointspanel'
    },{
        region: 'center',

        xtype: 'srm-sparkpoints-tabpanel'
    }]
});
