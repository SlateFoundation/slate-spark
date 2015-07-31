/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.StandardDocument', {
    extend: 'Jarvus.model.Postgrest',


    tableUrl: '/mock-standard_documents',
    fields: [
        'asn_id',
        'name',
        'subject',
        'jurisdiction',
        'grades'
    ]
});