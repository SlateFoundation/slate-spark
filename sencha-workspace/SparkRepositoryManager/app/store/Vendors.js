/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.Vendors', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.Vendor',
        'SparkRepositoryManager.proxy.Records'
    ],

    model: 'SparkRepositoryManager.model.Vendor',

    autoSync: true,

    proxy: {
        noCache: false,
        limitParam: '',
        type: 'spark-records',
        url: '/spark2/vendors',
        include: 'Domains'
    }
});
