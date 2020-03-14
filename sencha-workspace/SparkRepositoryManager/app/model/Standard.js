Ext.define('SparkRepositoryManager.model.Standard', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.API'
    ],


    tooltipTpl: [
        '<dl>',
        '<tpl if="subject">',
        '<dt>Subject</dt>',
        '<dt>{subject}</dt>',
        '</tpl>',
        '<tpl if="jurisdiction">',
        '<dt>Jurisdiction</dt>',
        '<dt>{jurisdiction}</dt>',
        '</tpl>',
        '<tpl if="asn_id">',
        '<dt>ASN ID</dt>',
        '<dt>{asn_id}</dt>',
        '</tpl>',
        '</dl>',
        '<p>{title}</p>'
    ],

    proxy: {
        type: 'spark-api',
        url: '/spark-repo/standards'
    },

    idProperty: 'asn_id',

    fields: [
        'asn_id',
        'code',
        'title',
        'parent_sort_order',
        'document_asn_id'
    ]
});
