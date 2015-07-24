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
            { Code: 'DFD50-A', Description: 'This is an example description', M: 'some text' },
            { Code: 'DFD50-A', Description: 'This is an example description', M: 'some text' },
            { Code: 'DFD50-A', Description: 'This is an example description', M: 'some text' },
            { Code: 'DFD50-A', Description: 'This is an example description', M: 'some text' }
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