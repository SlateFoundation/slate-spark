Ext.define('SparkRepositoryManager.model.ApplyProject', {
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
            defaultValue: 'Spark2\\ApplyProject'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            useNull: true,
            persist: false
        },
        {
            name: 'CreatorID',
            type: 'int',
            useNull: true,
            persist: false
        },
        {
            name: 'Title',
            type: 'string'
        },
        {
            name: 'Instructions',
            type: 'string'
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
            name: 'Todos',
            useNull: true
        },
        {
            name: 'Links',
            useNull: true,

            /*
             * In the Apply model, the URLs are currently stored as an array of strings in the Links field.
             * After we deploy the new UI we'll migrate the backend data in bulk to the new format on the
             * staging and production servers and then come back and delete this convert function.
             */
            convert: function (value) {
                var links = [],
                    i = 0,
                    count;

                if (Ext.isArray(value)) {
                    count = value.length;
                    if (Ext.isString(value[0])) {
                        for (i; i<count; i++) {
                            links.push({
                                title: null,
                                url: value[i]
                            });
                        }
                    } else {
                        links = value;
                    }
                }
                return links;
            }
        },
        {
            name: 'TimeEstimate',
            type: 'int',
            useNull: true
        },
        {
            name: 'Metadata',
            type: 'string',
            useNull: true
        },
        {
            name: 'CreatorFullName',
            type: 'string',
            persist: false
        }
    ],

    validators: {
        Title: [
            'presence'
        ]
    },

    proxy: {
        type: 'spark-records',
        url: '/spark2/apply-projects',
        include: ['CreatorFullName']
    }
});
