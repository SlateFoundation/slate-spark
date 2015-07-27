Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependencies', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointdependencies',

    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.DependenciesController',
        'SparkRepositoryManager.model.Sparkpoint',
        'SparkRepositoryManager.column.Sparkpoint'
    ],

    title: 'Dependencies',

    controller: 'srm-sparkpoints-sparkpointdependencies',

    store:{
        type: 'tree',
        model: 'SparkRepositoryManager.model.Sparkpoint',
        root: {
            expanded: true,
            children: [
                {Code: 'K.CC.4a', leaf: true },
                {
                    Code: 'K.CC.4b',
                    Description: 'This is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b',
                    children: [
                        { Code: 'K.CC.1a', leaf: true },
                        { Code: 'K.CC.1b', leaf: true },
                        { Code: 'K.CC.2b', leaf: true },
                        { Code: 'K.CC.3b', leaf: true }
                    ]
                },
                { Code: 'K.CC.4c', leaf: true },
                {
                    Code: 'K.CC.4d',
                    children: [
                        { Code: 'K.CC.1c', leaf: true },
                        { Code: 'K.CC.1d', leaf: true }
                    ]
                }
            ]
        }
    },

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
