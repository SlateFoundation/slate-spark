/*jslint browser: true, undef: true *//*global Ext*/
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
            name: "ID",
            type: "int",
            useNull: true
        },
        {
            name: "Class",
            type: "string",
            defaultValue: "Spark2\\LearnLink"
        },
        {
            name: "Created",
            type: "date",
            dateFormat: "timestamp",
            useNull: true
        },
        {
            name: "CreatorID",
            type: "int",
            useNull: true
        },
        {
            name: "RevisionID",
            type: "int",
            useNull: true
        },
        {
            name: "Title",
            type: "string"
        },
        {
            name: "URL",
            type: "string"
        },
        {
            name: "VendorID",
            type: "int",
            useNull: true
        },
        {
            name: "GradeLevel",
            type: "string",
            useNull: true
        },
        {
            name: "DOK",
            type: "int",
            useNull: true
        },
        {
            name: "Standards",
            useNull: true,
            convert: function(val) {
                // TODO: This can be safely removed after the migration
                if (Array.isArray(val)) {
                    return val.map(function(standard) {
                        if (typeof standard === 'object') {
                            return standard.standardCode;
                        } else {
                            return standard;
                        }
                    })
                }

                return [];
            }
        },
        {
            name: "StandardIDs",
            useNull: true
        },
        {
            name: "Metadata",
            useNull: true
        },
        {
            name: "CreatorFullName",
            type: "string"
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
        url: '/spark2/learn-links'
    }
});
