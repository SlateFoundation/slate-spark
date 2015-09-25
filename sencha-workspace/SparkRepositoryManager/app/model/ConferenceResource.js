/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.model.ConferenceResource', {
    extend:   'Ext.data.Model',

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
            name:         "Class",
            type:         "string",
            defaultValue: "Spark2\\ConferenceResource"
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
            useNull: true
        },
        {
            name: "StandardIDs",
            useNull: true
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
        url:  '/spark2/conference-resources'
    }
});