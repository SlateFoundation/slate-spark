/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Spark2Manager.model.StandardMapping', {
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
            defaultValue: "Spark2\\StandardMapping"
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
            name: "StandardID",
            type: "int"
        },
        {
            name: "ContextClass",
            type: "string"
        },
        {
            name: "ContextID",
            type: "int"
        }
    ],

    proxy: {
        type: 'records',
        url: '/spark2/standard-mappings'
    }
});
