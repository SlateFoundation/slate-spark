Ext.define('Spark2Manager.store.Vendor', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Vendor'
    ],

    model: 'Spark2Manager.model.Vendor',

    autoSync: true
});
