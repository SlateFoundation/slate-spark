/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.Vendors', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.Vendor',
        'Emergence.proxy.Records'
    ],

    model: 'SparkRepositoryManager.model.Vendor',

    autoSync: true,

    proxy: {
        noCache: false,
        type: 'records',
        url: '/spark2/vendors',
        include: 'Domains'
    }
});
