/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.Comments', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.Comment'
    ],

    model: 'SparkRepositoryManager.model.Comment',

    autoSync: true
});
