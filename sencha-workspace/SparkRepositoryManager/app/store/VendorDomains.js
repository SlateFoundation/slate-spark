Ext.define('SparkRepositoryManager.store.VendorDomains', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkRepositoryManager.model.VendorDomain'
    ],


    model: 'SparkRepositoryManager.model.VendorDomain',

    autoSync: true
});
