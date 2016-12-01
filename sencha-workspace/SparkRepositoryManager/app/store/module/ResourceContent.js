Ext.define('SparkRepositoryManager.store.lesson.ResourceContent', {
    extend: 'Ext.data.ChainedStore',

    requires: [
        'SparkRepositoryManager.store.ContentItems'
    ],

    source: 'ContentItems',

    groupField: 'sparkpointGroup',

    filters: [
        function(item) {
            return item.get('type') === 'conference_resource';
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
