/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.model.ApplyToDo', {
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
            defaultValue: "Spark2\\ApplyToDo"
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
            name: "ApplyProjectID",
            type: "int"
        },
        {
            name: "Order",
            type: "int"
        },
        {
            name: "Text",
            type: "string"
        }
    ],

    proxy: {
        type: 'spark-records',
        url: '/spark2/apply-todos'
    }
});
