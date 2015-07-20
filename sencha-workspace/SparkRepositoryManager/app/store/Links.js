/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.Links', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.Link'
    ],

    model: 'SparkRepositoryManager.model.Link',

    autoSync: true
});
