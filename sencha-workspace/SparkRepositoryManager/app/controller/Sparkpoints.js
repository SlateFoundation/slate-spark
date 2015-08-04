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
                boxready: 'onContentAreasTableReady'
            },
            sparkpointsTable: {
                boxready: 'onSparkpointsTableReady'
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

    onSparkpointsTableReady: function(sparkpointsTable) {
        var store = sparkpointsTable.getStore();

        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    },

    onDocumentsTableReady: function(contentAreasTable) {
        var store = contentAreasTable.getStore();

        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    },

    onDocumentSelect: function(contentAreasTable, document) {
        this.getDocumentStandardsStore().setRootNode(Ext.applyIf({
            expanded: true
        }, document.getData()));
    },

    onStandardsSearchChange: function(field, query) {
        var store = this.getStandardsTable().getStore(),
            queryRe = Ext.String.createRegex(query, false, false);

        store.clearFilter(true);

        store.filter(function(item) {
            var data = item.getData();

            return queryRe.test(data.code) || queryRe.test(data.name)
        });
    }
});