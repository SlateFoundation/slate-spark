Ext.define('SparkRepositoryManager.view.sparkpoints.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-grid',

    title: 'Grid',
    //store: Ext.data.StoreManager.lookup('Content'),
    store:{
        fields: [
         {name: 'Code', type: 'string'},
         {name: 'Description',  type: 'string'},
         {name: 'Mapped',  type: 'string'}
        ],
        data: [
            { Code: 'K.CC.1', Description: 'Count to 100 by ones and by tens.', M: 'K.CC.4a' },
            { Code: 'K.CC.4a', Description: 'Understand how to stop counting', M: 'K.CC.3a' },
            { Code: 'K.CC.4b', Description: 'Counting tiny numbers', M: 'K.G.1,2' },
            { Code: 'K.G.1,2', Description: 'Counting big numbers', M: 'K.G.2,1' }
        ]
    },

    dockedItems: [{
        dock: 'top',

        xtype: 'toolbar',
        items: [{
            flex: 1,

            xtype: 'jarvus-searchfield',
            emptyText: 'Search sparkpoints…'
        },{
            xtype: 'tbtext',
            html: 'Show: '
        },{
            xtype: 'button',
            toggleGroup: 'show',
            pressed: true,
            text: 'All'
        },{
            xtype: 'button',
            toggleGroup: 'show',
            text: 'Orphans'
        },{
            xtype: 'button',
            toggleGroup: 'show',
            text: 'Unmapped'
        }]
    }],

    columns: [{
        text: 'Sparkpoint',
        dataIndex: 'Code'
    },{
        text: 'Title',
        dataIndex: 'Description',
        flex: 1
    },{
        text: 'Previous?',
        dataIndex: 'M'
    },{
        text: 'Forward?',
        dataIndex: 'M'
    }]
});