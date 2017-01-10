Ext.define('SparkRepositoryManager.model.ApplyLink', {
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
            defaultValue: 'Spark2\\ApplyLink'
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
            name: 'RevisionID',
            type: 'int',
            useNull: true
        },
        {
            name: 'Title',
            type: 'string'
        },
        {
            name: 'URL',
            type: 'string'
        },
        {
            name: 'VendorID',
            type: 'int',
            useNull: true
        },
        {
            name: 'Metadata',
            type: 'string',
            useNull: true,
            convert: function (value) {
                var JSON = {};

                try {
                    JSON  = JSON.parse(value);
                } catch(e) {
                    // Empty catch
                }

                return JSON;
            }
        }
    ],

    proxy: {
        type: 'spark-records',
        url: '/spark2/apply-links',
        include: ['CreatorFullName']
    }
});
