Ext.define('SparkRepositoryManager.view.sparkpoints.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-grid',
    requires: [
        //'SparkRepositoryManager.store.sparkpoints.Selected',
        'SparkRepositoryManager.store.sparkpoints.Sparkpoints',
        'SparkRepositoryManager.column.Sparkpoint'
    ],

    title: 'Grid',
    //store: 'sparkpoints.Sparkpoints',

    store: {
        type: 'chained',
        source: 'sparkpoints.Sparkpoints'
    },

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

        text: 'Teacher Title',
        dataIndex: 'teacher_title'
    },{
        flex: 1,

        text: 'Student Title',
        dataIndex: 'student_title',
        hidden: true
    },{
        width: 50,

        text: '&larr;',
        dataIndex: 'dependencies_count',
        tooltip: '# of sparkpoints this sparkpoint depends on'
    },{
        width: 50,

        text: '&rarr;',
        dataIndex: 'dependents_count',
        tooltip: '# of sparkpoints that depend on this sparkpoint'
    },{
        width: 50,

        text: '&darr;',
        dataIndex: 'alignments_count',
        tooltip: '# of standards this sparkpoint is aligned to'
    }]
});
