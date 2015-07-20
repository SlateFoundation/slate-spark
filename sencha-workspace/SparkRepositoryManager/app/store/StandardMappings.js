Ext.define('SparkRepositoryManager.store.StandardMappings', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.StandardMapping'
    ],

    model: 'SparkRepositoryManager.model.StandardMapping',

    autoSync: true
});
