Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Implements', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointimplements',

    title: 'Implements',

    store:{
        type: 'tree',
        root: {
            expanded: true,
            children: [
                { Title: 'some text', leaf: true },
                { Title: 'some text', leaf: true },
                { Title: 'some text', leaf: true },
                { Title: 'some text', leaf: true }
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