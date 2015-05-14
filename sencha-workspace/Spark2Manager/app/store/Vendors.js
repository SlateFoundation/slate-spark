/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.Vendors', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Vendor',
        'Emergence.ext.proxy.Records'
    ],

    model: 'Spark2Manager.model.Vendor',

    autoSync: true,

    proxy: {
        noCache: false,
        type: 'records',
        url: '/spark2/vendors',
        include: 'Domains'
    }
});
