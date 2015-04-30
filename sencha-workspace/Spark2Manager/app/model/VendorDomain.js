/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.model.VendorDomain', {
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
            defaultValue: "Spark2\\VendorDomain"
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
            name: "VendorID",
            type: "int"
        },
        {
            name: "Domain",
            type: "string"
        },
        {
            name: "ContextClass",
            type: "string"
        }
    ],

    proxy: {
        type: 'records',
        url: '/spark2/vendor-domains'
    }
});
