/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.TagMaps', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.TagMap'
    ],

    model: 'SparkRepositoryManager.model.TagMap',

    autoSync: true
});
