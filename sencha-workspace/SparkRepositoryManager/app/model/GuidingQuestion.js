/*jslint browser: true, undef: true *//*global Ext*/

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
            name: "ID",
            type: "int",
            useNull: true
        },
        {
            name: "Class",
            type: "string",
            defaultValue: "Spark2\\GuidingQuestion"
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
            name: "Question",
            type: "string"
        },
        {
            name: "Standards",
            useNull: true,
            convert: function(val) {
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
            name: "GradeLevel",
            type: "string",
            useNull: true
        },
        {
            name: "CreatorFullName",
            type: "string"
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
        url: '/spark2/guiding-questions'
    }
});
