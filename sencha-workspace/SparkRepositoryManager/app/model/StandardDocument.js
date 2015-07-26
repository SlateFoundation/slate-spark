/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.StandardDocument', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.StandardDocuments'
    ],

    // model config
    idProperty: 'id',

    fields: [
        {
            name: 'id',
            type: 'string'
        },

        {
            name: 'title',
            type: 'string'
        }
    ],

    proxy: {
        type: 'spark-standarddocuments',
        url: 'http://commonstandardsproject.com/api/v1/jurisdictions'
    }
});


