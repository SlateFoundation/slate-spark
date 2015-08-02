Ext.define('SparkRepositoryManager.controller.Sparkpoints', {
    extend: 'Ext.app.Controller',

    stores: [
        'sparkpoints.Sparkpoints',
        'sparkpoints.Dependencies',
        'sparkpoints.Dependents',
        'StandardDocuments',
        'Standards'
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
        this.getStandardsStore().setFilters([{
            property: 'subject',
            value: document.get('subject')
        },{
            property: 'jurisdiction',
            value: document.get('jurisdiction')
        },{
            property: 'standard_document',
            value: document.get('name')
        }]);
    }
});