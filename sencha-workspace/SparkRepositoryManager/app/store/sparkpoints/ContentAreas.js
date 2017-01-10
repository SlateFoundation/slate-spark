Ext.define('SparkRepositoryManager.store.sparkpoints.ContentAreas', {
    extend: 'Ext.data.TreeStore',


    model: 'SparkRepositoryManager.model.ContentArea',
    pageSize: 0,
    remoteFilter: false,
    remoteSort: false,
    parentIdProperty: 'parentId',
    nodeParam: null,
    autoSync: true,

    /**
     * Go through records after treeify runs and mark all nodes withouth children as leafs
     */
    treeify: function(parentNode, records) {
        var result = this.callParent(arguments),
            recordsLength = records.length,
            recordIndex = 0, record;

        for (; recordIndex < recordsLength; recordIndex++) {
            record = records[recordIndex];
            record.set('leaf', !record.childNodes.length);
        }

        return result;
    }
});