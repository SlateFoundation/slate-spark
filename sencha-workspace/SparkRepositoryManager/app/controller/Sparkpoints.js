Ext.define('SparkRepositoryManager.controller.Sparkpoints', {
    extend: 'Ext.app.Controller',

    stores: [
        'sparkpoints.Sparkpoints',
        'sparkpoints.Dependencies',
        'sparkpoints.Dependents',
        'StandardDocuments',
        'DocumentStandards'
    ],

    config: {
        refs: {
            mainPanel: 'srm-sparkpoints-panel',
            contentAreasTable: 'srm-sparkpoints-contentareastable',
            sparkpointsTable: 'srm-sparkpoints-grid',
            documentsTable: 'srm-sparkpoints-documentstable',
            standardsTable: 'srm-sparkpoints-standardstable',
        },

        control: {
            contentAreasTable: {
                boxready: 'onContentAreasTableReady',
                select: 'onContentAreaSelect'
            },
            'srm-sparkpoints-contentareastable button[action=create]': {
                click: 'onCreateContentAreaClick'
            },


            documentsTable: {
                boxready: 'onDocumentsTableReady',
                select: 'onDocumentSelect'
            },
            'srm-sparkpoints-standardstable jarvus-searchfield': {
                change: 'onStandardsSearchChange'
            }
        }
    },


    onContentAreasTableReady: function(contentAreasTable) {
        var store = contentAreasTable.getStore();

        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    },

    onContentAreaSelect: function(contentAreasTable, contentArea) {
        var sparkpointsStore = this.getSparkpointsSparkpointsStore();

        sparkpointsStore.filter('content_area_id', contentArea.getId());
    },

    onCreateContentAreaClick: function() {
        var contentAreasTable = this.getContentAreasTable();

        contentAreasTable.getPlugin('cellediting').startEdit(
            contentAreasTable.getRootNode().appendChild({
                leaf: true,
                title: ''
            }),
            0 // first column
        );
    },

    onDocumentsTableReady: function(documentsTable) {
        var store = documentsTable.getStore();

        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    },

    onDocumentSelect: function(documentsTable, document) {
        this.getDocumentStandardsStore().setRootNode(Ext.applyIf({
            expanded: true
        }, document.getData()));
    },

    onStandardsSearchChange: function(field, query) {
        var store = this.getStandardsTable().getStore(),
            queryRe = Ext.String.createRegex(query, false, false);

        Ext.suspendLayouts();

        if (query) {
            store.filter({
                id: 'search',
                filterFn: function(node) {
                    if (node.isLeaf()) {
                        return queryRe.test(node.get('asn_id'))
                               || queryRe.test(node.get('code'))
                               || queryRe.test(node.get('alt_code'))
                               || queryRe.test(node.get('title'));
                    }
    
                    var children = node.childNodes,
                        len = children && children.length,
                        i = 0;
                        
                    for (; i < len; i++) {
                        if (children[i].get('visible')) {
                            return true;
                        }
                    }
                }
            });
        } else {
            store.clearFilter();
        }

        Ext.resumeLayouts(true);
    }
});