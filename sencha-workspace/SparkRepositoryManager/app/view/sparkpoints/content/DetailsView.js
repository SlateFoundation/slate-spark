Ext.define('SparkRepositoryManager.view.sparkpoints.content.DetailsView', {
    extend: 'Ext.container.Container',
    xtype: 'sparkpoints-content-detailsview',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'sparkpoints-content-detailsform',
        flex: 10
    },{
        xtype: 'sparkpoints-content-dependencies',
        flex: 10
    },{
        xtype: 'sparkpoints-content-dependents',
        flex: 10
    }]

});
