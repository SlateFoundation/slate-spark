Ext.define('SparkRepositoryManager.store.StandardDocuments', {
    extend: 'Ext.data.Store',
    requires: [
        /* global SparkRepositoryManager */
        'SparkRepositoryManager.model.StandardDocument'
    ],


    model: 'SparkRepositoryManager.model.StandardDocument',
    grouper: {
        property: 'subject',

        sortProperty: 'subject',
        transform: function(v) {
            return SparkRepositoryManager.model.StandardDocument.fieldsMap.subject.sortType(v);
        }
    },
    sorters: [{
        property: 'name'
    }]
});