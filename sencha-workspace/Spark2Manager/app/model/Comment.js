/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Spark2Manager.model.Comment', {
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
            defaultValue: "Emergence\\Comments\\Comment"
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
            name: "ContextClass",
            type: "string"
        },
        {
            name: "ContextID",
            type: "int"
        },
        {
            name: "Handle",
            type: "string"
        },
        {
            name: "ReplyToID",
            type: "int",
            useNull: true
        },
        {
            name: "Message",
            type: "string"
        }
    ],

    proxy: {
        type: 'records',
        url: '/comments'
    }
});
