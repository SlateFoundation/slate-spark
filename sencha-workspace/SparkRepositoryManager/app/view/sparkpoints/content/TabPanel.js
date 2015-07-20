Ext.define('SparkRepositoryManager.view.sparkpoints.content.TabPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'sparkpoints-content-tabpanel',

    items: [{
        xtype: 'sparkpoints-content-grid',
        title: 'Grid'
    },{
        xtype: 'sparkpoints-content-graph',
        title: 'Graph'
    },{
        xtype: 'sparkpoints-content-coverage',
        title: 'Coverage'
    }]

});
