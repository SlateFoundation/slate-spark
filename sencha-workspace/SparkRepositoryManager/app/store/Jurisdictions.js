/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.StandardDocuments', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'SparkRepositoryManager.model.StandardDocument'
    ],

    model: 'SparkRepositoryManager.model.StandardDocument'
});
