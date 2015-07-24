/*jslint browser: true, undef: true *//*global Ext*/
/**
 * Standards Grid, an extension of Ext.grid.Panel
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.standards.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-standardsgrid',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.standards.DocumentsTree'
    ],

    title: 'External standards',

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
    },{
        xtype: 'actioncolumn',
        width: 32,
        icon: 'http://i.imgur.com/wb1NW8I.png'
    }],

    dockedItems: [{
        dock: 'left',

        xtype: 'srm-sparkpoints-standarddocumentstree',
        width: 300
    },{
        dock: 'top',
        weight: 10,

        xtype: 'toolbar',
        items: [{
            flex: 1,

            xtype: 'jarvus-searchfield',
            emptyText: 'Search all standards…'
        },{
            xtype: 'checkboxfield',
            boxLabel: 'Unmapped only'
        }]
    }]
});