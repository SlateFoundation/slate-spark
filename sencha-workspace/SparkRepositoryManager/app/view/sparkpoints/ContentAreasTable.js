/*jslint browser: true, undef: true *//*global Ext*/
/**
 * Content Navigation Panel, an extension of Ext Panel with a vbox layout containing
 * a tree panel, with a formpanel/searchfield docked to top of container.
 *
 * @cfg title="ContentAreas"
 * @cfg {Object[]} dockedItems components to be added as docked items to this panel
 * @cfg {Ext.form.Panel} dockedItems.top A search form docked to top of container
 * @cfg {Jarvus.ext.form.field.Search} dockedItems.top.field  A field of xtype jarvus-searchfield from
 *     jarvus-ext-search package
 * @cfg {Object[]} items An array of child Components to be added to this container
 * @cfg {Ext.tree.Panel} items.treepanel A treepanel
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.ContentAreasTable', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-contentareastable',
    requires: [
        'Jarvus.ext.form.field.Search',
        'SparkRepositoryManager.model.ContentArea'
    ],

    title: 'Content Areas',

    dockedItems: [{
    //     dock: 'top',

    //     xtype: 'toolbar',
    //     items: [{
    //         flex: 1,

    //         xtype: 'jarvus-searchfield',
    //         emptyText: 'Search all content…'
    //     }]
    // },{
        dock: 'bottom',

        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            text: 'New Content Area',
            action: 'create'
        }]
    }],

    // treepanel config
    store: {
        xclass: 'Ext.data.TreeStore',
        model: 'SparkRepositoryManager.model.ContentArea',
        proxy: undefined, // force store to use model's proxy
    	remoteSort: true,
    	sorters: 'code',
    	nodeParam: null,
        autoSync: true
    },

    rootVisible: false,
    singleExpand: true,
    hideHeaders: true,

    columns: [
        {
            flex: 1,

            xtype: 'treecolumn',
            dataIndex: 'title',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        // },
        // {
        //     width: 32,
        //     align: 'right',
        //     dataIndex: 'Total'
        }
    ],

    selModel: {
        selType: 'cellmodel'
    },

    plugins: [{
        pluginId: 'cellediting',
        ptype: 'cellediting',
        clicksToEdit: 2
    }]
});