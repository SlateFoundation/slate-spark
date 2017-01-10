Ext.define('SparkRepositoryManager.view.sparkpoints.ContentAreaPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'srm-sparkpoints-contentareapanel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.Grid',
        'SparkRepositoryManager.view.sparkpoints.Graph',
        'SparkRepositoryManager.view.sparkpoints.Coverage'
    ],


    disabled: true,

    items: [{
        xtype: 'srm-sparkpoints-grid'
    }, {
        xtype: 'srm-sparkpoints-graph'
    }, {
        xtype: 'srm-sparkpoints-coverage'
    }]
});
