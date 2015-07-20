/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.model.Rating', {
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
            defaultValue: "Spark2\\Rating"
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
            name: "ContextClass",
            type: "string"
        },
        {
            name: "ContextID",
            type: "int"
        },
        {
            name: "Rating",
            type: "int"
        },
        {
            name: "RatingType",
            type: "string"
        },
        {
            name: "VendorID",
            type: "int",
            useNull: true
        },
        {
            name: "Ratings",
            type: "int",
            defaultValue: 1
        }
    ],

    proxy: {
        type: 'spark-records',
        url: '/ratings'
    }
});
