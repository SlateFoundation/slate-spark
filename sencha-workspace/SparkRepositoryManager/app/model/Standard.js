/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.model.Standard', {
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
            name: "ID",
            type: "int",
            useNull: true
        },
        {
            name: "Class",
            type: "string",
            defaultValue: "Spark2\\Standard"
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
            name: "Code",
            type: "string"
        },
        {
            name: "AltCode",
            type: "string"
        },
        {
            name: "IntCode",
            type: "string"
        },
        {
            name: "Title",
            type: "string"
        },
        {
            name: "Description",
            type: "string",
            useNull: true
        },
        {
            name: "Subject",
            type: "string"
        },
        {
            name: "StandardsBody",
            type: "string"
        },
        {
            name: "Source",
            type: "string"
        },
        {
            name: "ASN",
            type: "string"
        },
        {
            name: "ParentStandard",
            type: "string",
            useNull: true
        }
    ],

    proxy: {
        type: 'spark-records',
        url: '/spark2/standards'
    }
});
