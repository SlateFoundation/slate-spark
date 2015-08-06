Ext.define('SparkRepositoryManager.view.sparkpoints.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-grid',
    requires: [
        //'SparkRepositoryManager.store.sparkpoints.Selected',
        'SparkRepositoryManager.store.sparkpoints.Sparkpoints',
        'SparkRepositoryManager.column.Sparkpoint'
    ],

    title: 'Grid',
    store: 'sparkpoints.Sparkpoints',
    //store: 'sparkpoints-selected',

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
    },{
        dock: 'bottom',

        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            text: 'New Sparkpoint',
            action: 'create'
        }]
    }],

    columns: [{
        xtype: 'srm-sparkpointcolumn'
    },{
        flex: 1,

        text: 'Title',
        dataIndex: 'teacher_title'
    },{
        width: 50,

        text: '<-',
        dataIndex: 'dependencies_count'
    },{
        width: 50,

        text: '->',
        dataIndex: 'dependents_count'
    }]
});