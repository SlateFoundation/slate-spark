Ext.define('SparkRepositoryManager.store.sparkpoints.Lookup', {
    extend: 'Ext.data.Store',
    alias: 'store.sparkpoints-lookup',
    requires: [
        'SparkRepositoryManager.proxy.API'
    ],


    model: 'SparkRepositoryManager.model.Sparkpoint',
    proxy: {
        type: 'spark-api',
        url: '/spark-repo/sparkpoints',
        headers: {
            Prefer: 'return=minimal'
        }
    }
});