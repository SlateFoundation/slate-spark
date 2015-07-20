/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.VendorDomains', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.VendorDomain'
    ],

    model: 'SparkRepositoryManager.model.VendorDomain',

    autoSync: true
});
