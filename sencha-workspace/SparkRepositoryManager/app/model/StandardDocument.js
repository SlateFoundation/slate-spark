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
            type: 'string',
            // TODO: this is still in development - bc
            convert: function(val,rec) {
                if (rec.get('document')) {
                    return rec.get('document').title;
                }
                return val;
            }
        }
    ],

    proxy: {
        type: 'spark-standarddocuments',
        url: 'http://commonstandardsproject.com/api/v1/jurisdictions'
    }
});


