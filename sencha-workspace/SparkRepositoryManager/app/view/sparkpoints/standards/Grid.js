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
            { Code: 'K.CC.1.2c', Description: 'Counting numbers up to 10',  Mapped: 'K.CC.4.1a' },
            { Code: 'K.CC.3.4b', Description: 'Counting numbers up to 20',  Mapped: 'K.CC.2.1b' },
            { Code: 'K.CC.5.6c', Description: 'Counting numbers up to 30',  Mapped: 'K.CC.4.1c' },
            { Code: 'K.CC.7.8a', Description: 'Counting numbers up to 40',  Mapped: 'K.CC.4.1d' },
            { Code: 'K.CC.9.1a', Description: 'Counting numbers up to 50',  Mapped: 'K.CC.4.1d' },
            { Code: 'K.CC.2.3a', Description: 'Counting numbers up to 60',  Mapped: 'K.CC.4.1d' },
            { Code: 'K.CC.4.5a', Description: 'Counting numbers up to 70',  Mapped: 'K.CC.4.1d' },
            { Code: 'K.CC.6.1a', Description: 'Counting numbers up to 80',  Mapped: 'K.CC.4.1d' },
            { Code: 'K.CC.2.1a', Description: 'Counting numbers up to 90',  Mapped: 'K.CC.4.1d' },
            { Code: 'K.CC.1.1a', Description: 'Counting numbers up to 100', Mapped: 'K.CC.4.1d' }
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
        icon: 'http://i.imgur.com/k4BSyFG.png'
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