Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependents', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointdependents',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.DependentsController',
        'SparkRepositoryManager.column.TreeSparkpoint',
        'SparkRepositoryManager.field.SparkpointLookup',
        'SparkRepositoryManager.model.SparkpointEdge'
    ],


    controller: 'srm-sparkpoints-sparkpointdependents',

    title: 'Dependents',

    store: {
        type: 'tree',
        model: 'SparkRepositoryManager.model.SparkpointEdge',
        autoSync: true,
        root: {
            children: []
        }
    },

    rootVisible: false,
    useArrows: true,
    singleExpand: true,
    hideHeaders: true,
    viewConfig: {
        emptyText: 'None declared yet'
    },

    columns: [{
        flex: 1,

        xtype: 'srm-treesparkpointcolumn',
        dataIndex: 'other_sparkpoint_code',
        abbreviate: false
    },{
        width: 24,

        xtype: 'actioncolumn',
        items: [
            {
                action: 'delete',
                iconCls: 'sparkpoint-dependent-delete glyph-danger',
                glyph: 0xf056, // fa-minus-circle
                tooltip: 'Remove this sparkpoint as a dependent'
            }
        ]
    }],

    dockedItems: [{
        dock: 'bottom',

        xtype: 'toolbar',
        items: [{
            reference: 'lookupCombo',
            flex: 1,

            xtype: 'srm-field-sparkpointlookup'
        },{
            reference: 'addButton',

            xtype: 'button',
            action: 'add',
            disabled: true,
            text: 'Add'
        }]
    }]
});
