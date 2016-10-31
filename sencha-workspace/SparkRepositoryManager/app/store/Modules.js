Ext.define('SparkRepositoryManager.store.Modules', {
    extend: 'Ext.data.TreeStore',

    model: 'SparkRepositoryManager.model.Module',
    pageSize: 0,
    remoteFilter: false,
    remoteSort: false,
    parentIdProperty: 'contentAreaId',
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
    },

    listeners: {
        load: function(store, records) {
            console.log('store load!');
            console.log(records);

            if (!records)  {
                store.insert(0, {
                    id: 1,
                    code: 'ELA'
                });
                store.sync();
            }
        }
    },
/*
    root: {
        expanded: true,
        children: [
            {
                ID: 1,
                Code: 'ELA'
            },
            {
                ID: 2,
                Code: 'MATH'
            },
            {
                ID: 4,
                Code: 'SCI'
            },
            {
                ID: 5,
                Code: 'HIS'
            },
            {
                ID: 9,
                Code: 'HEALTH'
            },
            {
                ID: 10,
                Code: 'WL'
            },
            {
                ID: 11,
                Code: 'PE'
            },
            {
                ID: 14,
                Code: 'VA'
            },
            {
                ID: 16,
                Code: 'HABIT'
            },
            {
                ID: 17,
                Code: 'OLD'
            },
            {
                ID: 3,
                Code: 'MC'
            }
        ]
    }
*/
});

