Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependencies', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointdependencies',

    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.DependenciesController'
    ],

    title: 'Dependencies',

    controller: 'srm-sparkpoints-sparkpointdependencies-controller',

    config: {
        tooltip: null,
        tooltipTemplate: [
            '<h6>{Title}</h6>',
            '<p>line 1.....</p>'
        ]
    },

    listeners: {
        afterrender: 'onAfterrender'
    },

    store:{
        type: 'tree',
        root: {
            expanded: true,
            children: [
                {Title: 'K.CC.4a', leaf: true },
                {
                    Title: 'K.CC.4b',
                    children: [
                        { Title: 'K.CC.1a', leaf: true },
                        { Title: 'K.CC.1b', leaf: true },
                        { Title: 'K.CC.2b', leaf: true },
                        { Title: 'K.CC.3b', leaf: true }
                    ]
                },
                { Title: 'K.CC.4c', leaf: true },
                {
                    Title: 'K.CC.4d',
                    children: [
                        { Title: 'K.CC.1c', leaf: true },
                        { Title: 'K.CC.1d', leaf: true }
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
        xtype: 'treecolumn',
        flex: 5,
        dataIndex: 'Title'
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
