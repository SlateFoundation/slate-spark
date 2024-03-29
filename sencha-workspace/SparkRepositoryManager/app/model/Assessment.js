Ext.define('SparkRepositoryManager.model.Assessment', {
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
            defaultValue: 'Spark2\\Assessment'
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
            name: 'AssessmentTypeID',
            type: 'int',
            defaultValue: 1
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
            name: 'GradeLevel',
            type: 'string',
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
            useNull: true,
            defaultValue: 4
        },

        {
            name: 'RemoteAuthorName',
            useNull: true,
            type: 'string'
        },

        {
            name: 'RemoteAuthorIdentifier',
            useNull: true,
            type: 'string'
        },

        {
            name: 'Metadata',
            useNull: true,
            type: 'string'
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
        type: 'spark-records',
        url: '/spark2/assessments',
        include: ['CreatorFullName']
    }
});
