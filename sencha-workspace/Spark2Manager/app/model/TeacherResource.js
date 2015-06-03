/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.model.TeacherResource', {
    extend:   'Ext.data.Model',

    requires: [
        'Emergence.ext.proxy.Records',
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
            name:         "Class",
            type:         "string",
            defaultValue: "Spark2\\TeacherResource"
        },
        {
            name:       "Created",
            type:       "date",
            dateFormat: "timestamp",
            useNull:    true
        },
        {
            name:    "CreatorID",
            type:    "int",
            useNull: true
        },
        {
            name:    "RevisionID",
            type:    "int",
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
            name:    "GradeLevel",
            type:    "string",
            useNull: true
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
        type: 'records',
        url:  '/spark2/teacher-resources'
    }
});