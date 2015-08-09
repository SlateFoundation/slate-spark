/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependencies', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointdependencies',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.DependenciesController',
        'SparkRepositoryManager.column.TreeSparkpoint',
        'SparkRepositoryManager.model.SparkpointEdge'
    ],

    controller: 'srm-sparkpoints-sparkpointdependencies',

    title: 'Dependencies',

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

    columns: [{
        xtype: 'srm-treesparkpointcolumn',
        flex: 1
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
            xtype: 'combobox',
            flex: 1,
            store: {
                type: 'chained',
                source: 'sparkpoints.Sparkpoints'
            },
            queryMode: 'local',
            displayField: 'code',
            valueField: 'code',
            forceSelecton: true,
            typeAhead: true,
            allowBlank: true
        },{
            xtype: 'button',
            action: 'add',
            disabled: true,
            text: 'Add'
        }]
    }]
});
