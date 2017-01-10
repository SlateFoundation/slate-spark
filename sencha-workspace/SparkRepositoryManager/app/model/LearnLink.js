Ext.define('SparkRepositoryManager.model.LearnLink', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.Records',
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Presence'
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
            defaultValue: 'Spark2\\LearnLink'
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
            name: 'GradeLevel',
            type: 'string',
            useNull: true
        },
        {
            name: 'DOK',
            type: 'int',
            useNull: true
        },
        {
            name: 'Standards',
            useNull: true
        },
        {
            name: 'StandardIDs',
            useNull: true
        },
        {
            name: 'Type',
            useNull: true,
            type: 'string'
        },
        {
            name: 'Metadata',
            useNull: true
        },
        {
            name: 'CreatorFullName',
            type: 'string'
        }
    ],

    validators: {
        URL: [
            'presence'
        ],
        Title: [
            'presence'
        ]
    },

    proxy: {
        autoSync: false,
        type: 'spark-records',
        url: '/spark2/learn-links',
        include: ['CreatorFullName']
    }
});
