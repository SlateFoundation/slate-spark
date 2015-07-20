/*jslint browser: true, undef: true *//*global Ext*/
/**
 * Standards Grid, an extension of Ext.grid.Panel
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.standards.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'sparkpoints-standards-grid',

    //store: Ext.data.StoreManager.lookup('Standards'),
    store:{
        fields: [
         {name: 'Code', type: 'string'},
         {name: 'Description',  type: 'string'},
         {name: 'Mapped',  type: 'string'}
        ],
        data: [
            { Code: 'DFD50-A', Description: 'This is an example description', Mapped: 'is this an array?' },
            { Code: 'DFD50-A', Description: 'This is an example description', Mapped: 'is this an array?' },
            { Code: 'DFD50-A', Description: 'This is an example description', Mapped: 'is this an array?' },
            { Code: 'DFD50-A', Description: 'This is an example description', Mapped: 'is this an array?' }
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
            emptyText: 'Search all standards…'
        },{
            xtype: 'checkboxfield',
            flex: 5,
            boxLabel: 'Unmapped only'
        }]
    }],

    columns: [{
        text: 'Code',
        dataIndex: 'Code'
    },{
        text: 'Description',
        dataIndex: 'Description',
        flex: 1
    },{
        text: 'Mapped to',
        dataIndex: 'Mapped'
    }]

});
