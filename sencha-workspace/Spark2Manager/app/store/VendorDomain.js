Ext.define('Spark2Manager.store.VendorDomain', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.VendorDomain'
    ],

    model: 'Spark2Manager.model.VendorDomain',

    autoSync: true
});
