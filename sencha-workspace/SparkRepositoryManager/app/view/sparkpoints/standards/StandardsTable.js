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


    config: {
        expandAllThreshold: 10
    },

    disabled: true, // disabled until loaded
    stateful: true,
    stateId: 'srm-sparkpoints-standardstable',

    store: 'DocumentStandards',
    rootVisible: false,
    useArrows: true,
    sortableColumns: false,
    emptyText: 'No standards found matching your filter',
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
    }, {
        text: 'Code',
        dataIndex: 'alt_code',
        width: 100,
        renderer: function(v, metaData, record) {
            return v || record.get('code');
        }
    }, {
        text: 'ASN ID',
        dataIndex: 'asn_id',
        hidden: true
    }, {
        width: 50,

        text: '&uarr;',
        dataIndex: 'alignments_count',
        tooltip: '# of sparkpoints aligned to this standard'
    }, {
        width: 40,

        xtype: 'actioncolumn',
        menuDisabled: true,
        hideable: false,
        items: [
            {
                action: 'sparkpointseed',
                iconCls: 'standard-sparkpoint-seed glyph-success',
                glyph: 0xf055, // fa-plus-circle
                tooltip: 'Create new sparkpoint from this standard'
            },
            {
                action: 'sparkpointalign',
                iconCls: 'standard-sparkpoint-align',
                glyph: 0xf0c1, // fa-link
                tooltip: 'Align selected sparkpoint to this standard'
            }
        ]
    }],

    dockedItems: [{
        dock: 'top',
        weight: 10,

        xtype: 'toolbar',
        items: [{
            flex: 1,

            xtype: 'jarvus-searchfield',
            emptyText: 'Search all standards…'
        }, {
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

    onFilterChange: function() {
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