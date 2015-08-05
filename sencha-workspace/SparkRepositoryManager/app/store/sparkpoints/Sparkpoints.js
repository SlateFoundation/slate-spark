/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.Sparkpoints', {
    extend: 'Ext.data.Store',
    storeId: 'sparkpoints.Sparkpoints',

    model: 'SparkRepositoryManager.model.Sparkpoint',
    remoteFilter: true
});