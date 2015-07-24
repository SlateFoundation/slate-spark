Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Implements', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointimplements',

    title: 'Implements',

    store:{
        type: 'tree',
        root: {
            expanded: true,
            children: [
                { Title: 'K.CC.JK.1', leaf: true },
                { Title: 'K.CC.JK.2', leaf: true },
                { Title: 'K.CC.JK.3', leaf: true },
                { Title: 'K.CC.JK.4', leaf: true }
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