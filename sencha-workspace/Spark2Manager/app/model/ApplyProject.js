/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.model.ApplyProject', {
    extend: 'Ext.data.Model',
    requires: [
        'Emergence.ext.proxy.Records',
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
            defaultValue: "Spark2\\ApplyProject"
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
            name: "Instructions",
            type: "string"
        },
        {
            name: "DOK",
            type: "int",
            useNull: true
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
        type: 'records',
        url: '/spark2/apply-projects'
    }
});
