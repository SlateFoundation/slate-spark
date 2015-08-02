/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.Standards', {
    extend: 'Ext.data.Store',

    model: 'SparkRepositoryManager.model.Standard',
    pageSize: 0,
    proxy: {
        type: 'postgrest',
        url: '/standards'
    },
    remoteFilter: true
});