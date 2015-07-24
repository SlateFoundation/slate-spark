/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.Jurisdiction', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.Jurisdictions'
    ],

    // model config
    idProperty: 'id',

    fields: [
        {
            name: "id",
            type: "string"
        },

        {
            name: "title",
            type: "string"
        }
    ],

    proxy: {
        type: 'spark-jurisdictions',
        url: 'http://commonstandardsproject.com/api/v1/jurisdictions'
    }
});


