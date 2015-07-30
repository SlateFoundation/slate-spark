/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependents', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointdependents',

    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.DependentsController',
        'SparkRepositoryManager.store.sparkpoints.Dependents',
        'SparkRepositoryManager.column.Sparkpoint'
    ],

    title: 'Dependents',

    controller: 'srm-sparkpoints-sparkpointdependents',

    store: 'sparkpoints.Dependents',

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
