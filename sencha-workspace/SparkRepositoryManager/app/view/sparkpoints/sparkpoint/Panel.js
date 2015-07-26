Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'srm-sparkpoints-sparkpointspanel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Form',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependencies',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependents',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Implements'
    ],

    title: 'Selected Sparkpoint: K.CC.1',

    scrollable: 'y',
    bodyPadding: 10,

    items: [{
        xtype: 'srm-sparkpoints-sparkpointform'
    },{
        xtype: 'srm-sparkpoints-sparkpointdependencies'
    },{
        xtype: 'srm-sparkpoints-sparkpointdependents'
    },{
        xtype: 'srm-sparkpoints-sparkpointimplements'
    }]
});