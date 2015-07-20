/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.ApplyLinks', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.ApplyLink'
    ],

    model: 'SparkRepositoryManager.model.ApplyLink',

    autoSync: true
});
