/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Spark2Manager.model.LearnLink', {
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
            name: "DOK",
            type: "int",
            useNull: true
        },
        // TODO: Figure out how to deal with nested JSON
        {
            name: "Metadata",
            type: "string",
            useNull: true
        }
    ],

    proxy: {
        type: 'records',
        url: '/spark2/learn-links'
    }
});
