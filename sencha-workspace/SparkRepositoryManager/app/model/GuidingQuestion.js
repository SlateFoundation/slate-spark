Ext.define('SparkRepositoryManager.model.GuidingQuestion', {
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
            defaultValue: 'Spark2\\GuidingQuestion'
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
            name: 'Question',
            type: 'string'
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
            name: 'CreatorFullName',
            type: 'string'
        }
    ],

    validators: {
        Question: [
            'presence'
        ]
    },

    proxy: {
        autoSync: false,
        type: 'spark-records',
        url: '/spark2/guiding-questions',
        include: ['CreatorFullName']
    }
});
