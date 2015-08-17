/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.Standard', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.API'
    ],


    tooltipTpl: [
        '<p>The full description of <em>{Code}</em> can be displayed here <strong>with arbitrary markup</strong></p>',
        '<tpl if="Description">',
            '<p>{Description}</p>',
        '</tpl>'
    ],

    proxy: {
        type: 'spark-api',
        url: '/spark-repo/standards',
        writer: {
            allowSingle: false
        }
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
