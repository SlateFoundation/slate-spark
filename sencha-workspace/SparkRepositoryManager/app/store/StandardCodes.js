Ext.define('SparkRepositoryManager.store.StandardCodes', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.proxy.Memory'
    ],

    config: {
        idProperty: 'standardCode',
        fields: ['standardCode'],
        proxy: {
            type: 'memory',
            reader: {
                type: 'json'
            }
        }
    }
});