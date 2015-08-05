Ext.define('SparkRepositoryManager.view.sparkpoints.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'srm-sparkpoints-panel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.ContentAreasTable',
        'SparkRepositoryManager.view.sparkpoints.ContentAreaPanel',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Panel',
        'SparkRepositoryManager.view.sparkpoints.standards.StandardsTable'
    ],

    layout: 'border',

    items: [{
        region: 'south',
        split: true,
        collapsible: true,

        xtype: 'panel',
        title: 'Standards',
        height: 300,
        stateful: true,
        stateId: 'srm-sparkpoints-standardsct',
        layout: 'border',
        items: [{
            region: 'west',
            split: true,
            collapsible: true,

            xtype: 'srm-sparkpoints-documentstable',
            width: 450
        },{
            region: 'center',

            xtype: 'srm-sparkpoints-standardstable',
        }]
    },{
        region: 'west',
        split: true,

        xtype: 'srm-sparkpoints-contentareastable',
        width: 300,
        collapsible: true
    },{
        region: 'east',
        split: true,
        collapsible: true,

        xtype: 'srm-sparkpoints-sparkpointpanel',
        width: 300
    },{
        region: 'center',

        xtype: 'srm-sparkpoints-contentareapanel'
    }]
});