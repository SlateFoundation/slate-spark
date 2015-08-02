/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.StandardDocuments', {
    extend: 'Ext.data.Store',

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