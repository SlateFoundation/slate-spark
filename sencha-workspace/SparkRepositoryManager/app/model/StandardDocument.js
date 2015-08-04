/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.StandardDocument', {
    extend: 'Jarvus.model.Postgrest',


    tableUrl: '/mock-standards_documents',
    idProperty: 'asn_id',
    fields: [
        'asn_id',
        {
            name: 'name',
            sortType: function (v) {
                return v.replace(/^\([^)]+\)\s*/i, '');
            }
        },
        {
            name: 'subject',
            sortType: function (v) {
                // TODO: convert to a reusable sortType
                return v.replace(/^the\s+/i, '');
            }
        },
        'jurisdiction',
        'children_count'
    ]
});