Ext.define('SparkRepositoryManager.store.StandardCodes', {
    extend: 'Ext.data.Store',

    config: {
        idProperty: 'id',
        fields: [
            'id',
            'code'
        ]
    }
});