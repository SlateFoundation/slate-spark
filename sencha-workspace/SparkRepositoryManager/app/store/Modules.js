Ext.define('SparkRepositoryManager.store.Modules', {
    extend: 'Ext.data.TreeStore',

    model: 'SparkRepositoryManager.model.Module',
    pageSize: 0,
    remoteFilter: false,
    remoteSort: false,
    parentIdProperty: 'parentId',
	nodeParam: null,
    autoSync: true,

    root: {
        expanded: true,
        children: [{
            id: 'global',
            code: 'Global Modules',
            expanded: true
        }, {
            id: 'personal',
            code: 'Your Modules',
            expanded: true
        }]
    },

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
    },

    listeners: {
        load: function(store, records) {
            // console.log('store load!');
            // console.log(records);
        //    console.log('load !!!!!!!!!!!!!!!!!');
/*
                store.insert(0, {
                    id: 1,
                    code: 'ELA'
                });
                store.sync();
*/
        }
    }
});

