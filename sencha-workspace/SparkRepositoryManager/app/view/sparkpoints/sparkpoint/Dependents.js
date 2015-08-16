/*jslint browser: true, undef: true *//*global Ext*/
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
        xtype: 'actioncolumn',
        action: 'delete',
        width: 32,
        // TODO: remove icon config and uncomment glyph config when glyphs are working
        // glyph: 0xf056, // fa-minus-circle
        icon: 'http://www.goodsync.com/images/icons/C_Dis_Cir.png',
        tooltip: 'Delete'
    }],

    dockedItems: [{
        dock: 'bottom',

        xtype: 'toolbar',
        items: [{
            xtype: 'srm-field-sparkpointlookup',
            flex: 1
        },{
            xtype: 'button',
            action: 'add',
            disabled: true,
            text: 'Add'
        }]
    }]
});
