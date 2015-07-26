Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependents', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointdependents',

    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.DependentsController'
    ],

    title: 'Dependents',

    controller: 'srm-sparkpoints-sparkpointdependents-controller',

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
                { Title: 'K.CC.3a', leaf: true },
                { Title: 'K.CC.3b', leaf: true },
                { Title: 'K.CC.3c', leaf: true },
                {
                    Title: 'K.CC.3d',
                    children: [
                        { Title: 'K.CC.1a', leaf: true },
                        { Title: 'K.CC.1b', leaf: true },
                        { Title: 'K.CC.2d', leaf: true }
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
