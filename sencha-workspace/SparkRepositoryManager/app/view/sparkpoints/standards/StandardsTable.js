/*jslint browser: true, undef: true *//*global Ext*/
/**
 * Standards Grid, an extension of Ext.grid.Panel
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.standards.StandardsTable', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-standardstable',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.standards.DocumentsTable',
        'Ext.data.ChainedStore'
    ],

    title: 'External standards',

    emptyText: 'No standards found matching your filter',

    store: 'DocumentStandards',
    rootVisible: false,
    useArrows: true,
    sortableColumns: false,
    // singleExpand: true,
    // store: {
    //     type: 'chained',
    //     source: 'Standards'
    // },

    columns: [{
        xtype: 'treecolumn',
        text: 'Name',
        dataIndex: 'title',
        flex: 1
    },{
        text: 'Code',
        dataIndex: 'alt_code',
        width: 100,
        renderer: function(v, metaData, record) {
            return v || record.get('code');
        }
    },{
        text: 'ASN ID',
        dataIndex: 'asn_id',
        hidden: true
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

        xtype: 'srm-sparkpoints-documentstable',
        width: 450
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