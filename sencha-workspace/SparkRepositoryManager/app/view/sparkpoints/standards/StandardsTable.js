/*jslint browser: true, undef: true *//*global Ext*/
/**
 * Standards Grid, an extension of Ext.grid.Panel
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.standards.StandardsTable', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-standardstable',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.standards.DocumentsTable',
        'SparkRepositoryManager.column.StatementTree'
        // 'Ext.data.ChainedStore'
    ],

    title: 'External standards',

    config: {
        expandAllThreshold: 10
    },

    emptyText: 'No standards found matching your filter',

    store: 'DocumentStandards',
    rootVisible: false,
    useArrows: true,
    sortableColumns: false,
    viewConfig: {
        stripeRows: true
    },
    // singleExpand: true,
    // store: {
    //     type: 'chained',
    //     source: 'Standards'
    // },

    columns: [{
        xtype: 'srm-statementtreecolumn'
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
            boxLabel: 'Unmapped only',
            disabled: true // TODO: implement
        }]
    }],


    onRootChange: function(root, oldRoot) {
        oldRoot.un('filterchange', 'onFilterChange', this);
        root.on('filterchange', 'onFilterChange', this);

        this.callParent(arguments);
    },

    onFilterChange: function(store, filterNodes) {
        this.autoExpand();
    },

    autoExpand: function() {
        var me = this,
            rootNode = me.getRootNode(),
            visibleLeafs = [],
            firstVisibleLeaf;

        // collapse all if there is no filter
        if (!me.getStore().getFilters().getCount()) {
            rootNode.collapseChildren(true);
            return;
        }

        // compile list of all matched leafs
        rootNode.cascadeBy(function(node) {
            if (node.get('visible') && node.isLeaf()) {
                visibleLeafs.push(node);

                if (!firstVisibleLeaf) {
                    firstVisibleLeaf = node;
                }
            }
        });

        // if there are matches and its less than the threshold, expand all
        if (visibleLeafs.length && visibleLeafs.length <= me.getExpandAllThreshold()) {
            rootNode.expandChildren(true);
        } else {
            rootNode.collapseChildren(true);
        }

        // ensure at least the first match is visible
        if (firstVisibleLeaf) {
            me.ensureVisible(firstVisibleLeaf.getPath());
        }
    },


    listeners: {
        load: function() {
            this.autoExpand();
        }
    }
});