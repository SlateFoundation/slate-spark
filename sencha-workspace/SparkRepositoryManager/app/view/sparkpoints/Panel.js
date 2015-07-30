Ext.define('SparkRepositoryManager.view.sparkpoints.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'srm-sparkpoints-panel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.ContentAreasTree',
        'SparkRepositoryManager.view.sparkpoints.TabPanel',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Panel',
        'SparkRepositoryManager.view.sparkpoints.standards.Grid'
    ],

    layout: 'border',

    items: [{
        region: 'south',
        split: true,

        xtype: 'srm-sparkpoints-standardsgrid',
        height: 300,
        collapsible: true,

        stateful: true,
        stateId: 'srm-sparkpoints-standardsgrid'
    },{
        region: 'west',
        split: true,

        xtype: 'srm-sparkpoints-contentareastree',
        width: 300,
        collapsible: true,

        stateful: true,
        stateId: 'srm-sparkpoints-contentareastree'
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
