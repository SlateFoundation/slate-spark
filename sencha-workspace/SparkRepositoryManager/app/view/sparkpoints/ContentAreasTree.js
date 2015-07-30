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
Ext.define('SparkRepositoryManager.view.sparkpoints.ContentAreasTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-contentareastree',
    requires: [
        'Jarvus.ext.form.field.Search',
        'SparkRepositoryManager.store.sparkpoints.ContentAreas'
    ],

    title: 'Content Areas',

    dockedItems: [{
        dock: 'top',

        xtype: 'toolbar',
        items: [{
            flex: 1,

            xtype: 'jarvus-searchfield',
            emptyText: 'Search all content…'
        }]
    }],

    // treepanel config
    store: 'sparkpoints-contentareas',

    rootVisible: false,
    useArrows: true,
    singleExpand: true,
    hideHeaders: true,
    viewConfig: {
        toggleOnDblClick: false
    },

    columns: [
        {
            xtype: 'treecolumn',
            flex: 1,
            dataIndex: 'title'
        // },
        // {
        //     width: 32,
        //     align: 'right',
        //     dataIndex: 'Total'
        }
    ]
});