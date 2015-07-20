/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.Tags', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.Tag'
    ],

    model: 'SparkRepositoryManager.model.Tag',

    autoSync: true
});
