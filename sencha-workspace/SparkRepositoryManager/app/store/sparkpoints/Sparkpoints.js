Ext.define('SparkRepositoryManager.store.sparkpoints.Sparkpoints', {
    extend: 'Ext.data.Store',


    model: 'SparkRepositoryManager.model.Sparkpoint',
    remoteFilter: true,
    autoSync: true
});