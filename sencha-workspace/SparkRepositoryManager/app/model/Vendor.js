Ext.define('SparkRepositoryManager.model.Vendor', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.Records',
        'Ext.data.identifier.Negative'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        {
            name: 'ID',
            type: 'int',
            useNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Spark2\\Vendor'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            useNull: true
        },
        {
            name: 'CreatorID',
            type: 'int',
            useNull: true
        },
        {
            name: 'Name',
            type: 'string'
        },
        {
            name: 'Description',
            type: 'string',
            useNull: true
        },
        {
            name: 'LogoURL',
            type: 'string',
            useNull: true
        }
    ],

    proxy: {
        type: 'spark-records',
        url: '/spark2/vendors'
    }
});
