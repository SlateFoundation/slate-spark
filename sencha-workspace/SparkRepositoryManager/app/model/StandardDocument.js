/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.StandardDocument', {
    extend: 'Ext.data.Model',

    idProperty: 'asn_id',
    fields: [
        {
            name: 'name',
            sortType: function (v) {
                return v ? v.replace(/^\([^)]+\)\s*/i, '') : null;
            }
        },
        {
            name: 'subject',
            sortType: function (v) {
                // TODO: convert to a reusable sortType
                return v ? v.replace(/^the\s+/i, '') : null;
            }
        }
    ],

    proxy: {
        type: 'spark-api',
        url: '/standards/documents'
    }
});