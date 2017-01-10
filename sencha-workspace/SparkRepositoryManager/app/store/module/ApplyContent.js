Ext.define('SparkRepositoryManager.store.lesson.ApplyContent', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SparkRepositoryManager.store.ContentItems'
    ],


    source: 'ContentItems',
    groupField: 'sparkpointGroup',

    filters: [
        function(item) {
            return item.get('type') === 'apply';
        }
    ],

    listeners: {
        refresh: function(store) {
            var filters = store.getFilters().getRange();

            store.suspendEvents();
            store.clearFilter(true);
            store.addFilter(filters);
            store.resumeEvents();
        }
    }
});
