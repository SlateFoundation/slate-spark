Ext.define('SparkRepositoryManager.view.sparkpoints.TabPanel', {
    extend:   'Ext.tab.Panel',
    xtype:    'srm-sparkpoints-tabpanel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.Grid',
        'SparkRepositoryManager.view.sparkpoints.Graph',
        'SparkRepositoryManager.view.sparkpoints.Coverage'
    ],

    items: [{
        xtype: 'srm-sparkpoints-grid'
    }, {
        xtype: 'srm-sparkpoints-graph'
    }, {
        xtype: 'srm-sparkpoints-coverage'
    }]
});