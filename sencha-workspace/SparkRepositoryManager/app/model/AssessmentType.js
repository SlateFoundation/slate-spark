/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.model.AssessmentType', {
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
            defaultValue: "Spark2\\AssessmentType"
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
            type: "string"
        }
    ],

    proxy: {
        type: 'spark-records',
        limitParam: null,
        startParam: null,
        url: '/spark2/assessment-types'
    }
});
