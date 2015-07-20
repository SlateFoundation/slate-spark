Ext.define('SparkRepositoryManager.view.sparkpoints.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'sparkpoints-panel',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        flex: 6,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'sparkpoints-navpanel',
            flex: 20
        },{
            xtype: 'sparkpoints-content-tabpanel',
            flex: 55
        },{
            xtype: 'sparkpoints-content-detailsview',
            flex: 25
        }]
    },{
        xtype: 'panel',
        flex: 3,
        title: 'External Standards',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'sparkpoints-standards-navpanel',
            flex: 20
        },{
            xtype: 'sparkpoints-standards-grid',
            flex: 80
        }]
    }]


});
