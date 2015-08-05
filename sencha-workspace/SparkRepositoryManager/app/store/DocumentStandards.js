/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.DocumentStandards', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'SparkRepositoryManager.proxy.Standards'
    ],

    model: 'SparkRepositoryManager.model.Standard',
    pageSize: 0,
    remoteFilter: false,
    remoteSort: false,
    parentIdProperty: 'parent_asn_id',
    proxy: {
        type: 'spark-standards'
    },
    root: {
        expanded: true,
        children: []
    },

    /**
     * Expand all nodes by default
     */
    // onProxyLoad: function(operation) {
    //     var records = operation.getRecords(),
    //         recordsLength = records.length,
    //         recordIndex = 0;

    //     for (; recordIndex < recordsLength; recordIndex++) {
    //         records[recordIndex].set('expanded', true);
    //     }

    //     this.callParent(arguments);
    // },

    /**
     * Go through records after treeify runs and mark all nodes withouth children as leafs
     * 
     * Disabled for now because the current API is doing this for us
     */
    // treeify: function(parentNode, records) {
    //     var result = this.callParent(arguments),
    //         recordsLength = records.length,
    //         recordIndex = 0, record;

    //     for (; recordIndex < recordsLength; recordIndex++) {
    //         record = records[recordIndex];
    //         record.set('leaf', !record.childNodes.length);
    //     }

    //     return result;
    // }
});