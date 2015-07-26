Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependents', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointdependents',

    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.DependenciesController',
        'SparkRepositoryManager.model.Sparkpoint',
        'SparkRepositoryManager.column.Sparkpoint'
    ],

    title: 'Dependents',

    controller: 'srm-sparkpoints-sparkpointdependents',

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
        width: 32,
        icon: 'http://i.imgur.com/wb1NW8I.png'
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
