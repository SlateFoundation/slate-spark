/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Spark2Manager.model.GuidingQuestion', {
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
            defaultValue: "Spark2\\GuidingQuestion"
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
            name: "Question",
            type: "string"
        }
    ],

    proxy: {
        type: 'records',
        url: '/spark2/guiding-questions'
    }
});
