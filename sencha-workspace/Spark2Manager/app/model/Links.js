/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.model.Links', {
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
            defaultValue: "Spark2\\Link"
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
            name: "Title",
            type: "string"
        },
        {
            name: "Link",
            type: "string"
        },
        {
            name: "Vendor",
            type: "string",
            useNull: true
        },
        {
            name: "DOK",
            type: "int",
            useNull: true
        },
        {
            name: "Category",
            type: "string",
            useNull: true
        },
        {
            name: "Notes",
            type: "string",
            useNull: true
        }
    ],

    proxy: {
        type: 'records',
        url: '/spark2/links'
    }
});
