Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Panel', {
    extend: 'Ext.container.Container',
    xtype: 'srm-sparkpoints-sparkpointspanel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Form',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependencies',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependents',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Implements'
    ],

    title: 'Selected Sparkpoint',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'srm-sparkpoints-sparkpointform',
        flex: 10
    },{
        xtype: 'srm-sparkpoints-sparkpointdependencies',
        flex: 10
    },{
        xtype: 'srm-sparkpoints-sparkpointdependents',
        flex: 10
    },{
        xtype: 'srm-sparkpoints-sparkpointimplements',
        flex: 10
    }]
});