/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.StandardDocuments', {
    extend: 'Ext.data.Store',

    model: 'SparkRepositoryManager.model.StandardDocument',
    groupField: 'subject',
    sorters: [{
        property: 'name'
    }]
});