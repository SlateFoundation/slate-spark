Ext.define('SparkRepositoryManager.view.sparkpoints.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-grid',
    requires: [
        'SparkRepositoryManager.store.sparkpoints.Selected',
        'SparkRepositoryManager.column.Sparkpoint'
    ],

    title: 'Grid',
    store: 'sparkpoints-selected',

    dockedItems: [{
        dock: 'top',

        xtype: 'toolbar',
        items: [{
            flex: 1,

            xtype: 'jarvus-searchfield',
            emptyText: 'Search sparkpoints…'
        },{
            xtype: 'tbtext',
            html: 'Show: '
        },{
            xtype: 'button',
            toggleGroup: 'show',
            pressed: true,
            text: 'All'
        },{
            xtype: 'button',
            toggleGroup: 'show',
            text: 'Orphans'
        },{
            xtype: 'button',
            toggleGroup: 'show',
            text: 'Unmapped'
        }]
    }],

    columns: [{
        xtype: 'srm-sparkpointcolumn'
    },{
        text: 'Title',
        dataIndex: 'title',
        flex: 1
    },{
        text: 'Previous?',
        dataIndex: 'M'
    },{
        text: 'Forward?',
        dataIndex: 'M'
    }]
});