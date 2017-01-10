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
        limitParam: null,
        startParam: null,
        type: 'spark-records',
        url: '/spark2/vendors',
        include: 'Domains'
    }
});
