/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.model.Vendor', {
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
            defaultValue: "Spark2\\Vendor"
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
            name: "Name",
            type: "string"
        },
        {
            name: "Description",
            type: "string",
            useNull: true
        },
        {
            name: "LogoURL",
            type: "string",
            useNull: true
        }
    ],

    proxy: {
        type: 'records',
        url: '/spark2/vendors'
    }
});
