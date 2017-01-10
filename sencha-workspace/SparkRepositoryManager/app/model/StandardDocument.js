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
        url: '/spark-repo/standards-documents'
    }
});