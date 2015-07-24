Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Implements', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-sparkpointimplements',


    //store: 'StandardsCategories',
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

/*
    viewConfig: {
        toggleOnDblClick: false
    },
*/

    dockedItems: [{
        dock: 'top',
        xtype: 'container',
        html: 'Implements'
    },{
        dock: 'bottom',
        xtype: 'form',
        cls: 'navpanel-search-form',
        layout: 'hbox',
        items: [{
            xtype: 'textfield',
            flex: 5
        },{
            xtype: 'button',
            text: 'Add'
        }]
    }],

    columns: [{
        xtype: 'treecolumn',
        flex: 5,
        dataIndex: 'Title'
    },{
        xtype: 'actioncolumn',
        width: 32,
        icon: 'http://i.imgur.com/wb1NW8I.png'
    }]
});