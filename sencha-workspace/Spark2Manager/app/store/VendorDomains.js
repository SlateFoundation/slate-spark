/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.VendorDomains', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.VendorDomain'
    ],

    model: 'Spark2Manager.model.VendorDomain',

    autoSync: true
});
