/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.DocumentStandards', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'Jarvus.proxy.Postgrest',
        'Jarvus.reader.Postgrest'
    ],

    model: 'SparkRepositoryManager.model.Standard',
    pageSize: 0,
    remoteFilter: false,
    remoteSort: false,
    nodeParam: 'asn_id',
    parentIdProperty: 'parent_asn_id',
    proxy: {
        type: 'postgrest',
        url: '/mock-standards_documents_full',
        sortParam: false,
        reader: {
            type: 'postgrest',
            transform: function(data) {
                return data[0].children;
            }
        }
    },
    root: {
        // asn_id: 'D10003FC',
        expanded: true
    },
    sorters: [{
        property: 'alt_code'
    }]
});