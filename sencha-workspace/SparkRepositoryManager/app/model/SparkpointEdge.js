Ext.define('SparkRepositoryManager.model.SparkpointEdge', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.API',
        'Ext.data.identifier.Negative'
    ],


    identifier: 'negative',

    proxy: {
        type: 'spark-api',
        url: '/spark-repo/sparkpoint-edges',
        extraParams: {
            include: 'other_sparkpoint'
        },
        writer: {
            type: 'api',
            allowSingle: false
        }
    },

    fields: [
        'id',
        'target_sparkpoint_id',
        'source_sparkpoint_id',
        'rel_type',
        'metadata',
        { name: 'other_sparkpoint',
            persist: false },
        { name: 'other_sparkpoint_code',
            mapping: 'other_sparkpoint.code' },

        // prevent tree meta-fields from being written to server
        { name: 'parentId',
            persist: false },
        { name: 'leaf',
            persist: false }
    ]
});