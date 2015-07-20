Ext.define('SparkRepositoryManager.view.sparkpoints.content.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'sparkpoints-content-grid',

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
        xtype: 'form',
        layout: {
            type: 'hbox'
        },
        cls: 'navpanel-search-form',
        items: [{
            xtype: 'jarvus-searchfield',
            flex: 5,
            emptyText: 'Search sparkpoints...'
        },{
            xtype: 'container',
            title: 'Show',
            flex: 5,
            layout: 'hbox',
            items: [{
                xtype: 'box',
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
