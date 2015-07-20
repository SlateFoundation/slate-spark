/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.model.GradeLevel', {
    extend: 'Ext.data.Model',
    requires: [
        'Emergence.proxy.Records',
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
            defaultValue: "Spark2\\GradeLevel"
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
            name: "GK",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G1",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G2",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G3",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G4",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G5",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G6",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G7",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G8",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G9",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G10",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G11",
            type: "boolean",
            defaultValue: false
        },
        {
            name: "G12",
            type: "boolean",
            defaultValue: false
        }
    ],

    proxy: {
        type: 'records',
        url: '/spark2/grade-levels'
    }
});
