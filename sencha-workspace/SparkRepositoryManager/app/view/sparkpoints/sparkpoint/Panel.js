Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'srm-sparkpoints-sparkpointpanel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Form',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependencies',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependents',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Implements'
    ],

    title: 'Selected Sparkpoint: K.CC.1',

    disabled: true,
    scrollable: 'y',
    bodyPadding: 10,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    stateful: true,
    stateId: 'srm-sparkpoints-sparkpointpanel',

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