/*jslint browser: true, undef: true *//*global Ext*/
/**
 * Content Navigation Panel, an extension of Ext Panel with a vbox layout containing
 * a tree panel, with a formpanel/searchfield docked to top of container.
 *
 * @cfg title="ContentAreas"
 * @cfg {Object[]} dockedItems components to be added as docked items to this panel
 * @cfg {Ext.form.Panel} dockedItems.top A search form docked to top of container
 * @cfg {Jarvus.ext.form.field.Search} dockedItems.top.field  A field of xtype jarvus-searchfield from jarvus-ext-search package
 * @cfg {Object[]} items An array of child Components to be added to this container
 * @cfg {Ext.tree.Panel} items.treepanel A treepanel
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.NavPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'sparkpoints-navpanel',

    requires: [
        'Ext.form.Panel',
        'Jarvus.ext.form.field.Search'
    ],

    title: 'Content Areas',
    autoScroll: true,

    dockedItems: [{
        dock: 'top',
        xtype: 'form',
        cls: 'navpanel-search-form',
        items: [{
            xtype: 'jarvus-searchfield',
            anchor: '100%',
            emptyText: 'Search all content…'
        }]
    }],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    /**
     */
    items: [{
        xtype: 'treepanel',
        itemId: 'content',

        // treepanel config
        //store: 'SparkpointCategories',
        store:{
            type: 'tree',
            root: {
                expanded: true,
                children: [
                    { Title: 'Math', Total: 35, leaf: true },
                    { Title: 'Reading', Total: 21, leaf: true },
                    { Title: 'Science', Total: 25, leaf: true },
                    { Title: 'Puppies', Total: 17, expanded: true, children: [
                        { Title: 'Orphans', Total: 8, leaf: true },
                        { Title: 'Needs something', Total: 9, leaf: true}
                    ]}
                ]
            }
        },

        scroll: false,
        rootVisible: false,
        useArrows: true,
        singleExpand: true,
        hideHeaders: true,
        viewConfig: {
            toggleOnDblClick: false
        },
        columns: [{
            xtype: 'treecolumn',
            flex: 1,
            dataIndex: 'Title'
        },{
            width: 32,
            align: 'right',
            dataIndex: 'Total'
        }]
    }]
});
