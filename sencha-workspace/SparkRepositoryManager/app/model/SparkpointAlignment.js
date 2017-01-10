Ext.define('SparkRepositoryManager.model.SparkpointAlignment', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.API',
        'Ext.data.identifier.Negative'
    ],


    identifier: 'negative',

    proxy: {
        type: 'spark-api',
        url: '/spark-repo/sparkpoint-alignments',
        extraParams: {
            include: 'standard'
        }
    },

    fields: [
        'id',
        'asn_id',
        'sparkpoint_id',
        { name: 'standard',
            persist: false }
    ]
});