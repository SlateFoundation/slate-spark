/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependencies', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointdependencies',

    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.DependenciesController',
        'SparkRepositoryManager.store.sparkpoints.Dependencies',
        'SparkRepositoryManager.column.Sparkpoint'
    ],

    title: 'Dependencies',

    controller: 'srm-sparkpoints-sparkpointdependencies',

    store: 'sparkpoints.Dependencies',

    rootVisible: false,
    useArrows: true,
    singleExpand: true,
    hideHeaders: true,

    columns: [{
        xtype: 'treecolumn', // can't use sparkpointcolumn directly because we need a treecolumn here
        flex: 5,
        dataIndex: 'Code',
        renderer: function() {
            return SparkRepositoryManager.column.Sparkpoint.prototype.renderer.apply(this, arguments);
        }
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
            flex: 1,

            xtype: 'textfield'
        },{
            xtype: 'button',
            text: 'Add'
        }]
    }]
});
