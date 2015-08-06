/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.proxy.Sparkpoints', {
    extend: 'SparkRepositoryManager.proxy.API',
    alias: 'proxy.spark-sparkpoints',


    getParams: function(operation) {
        var action = operation.getAction(),
            isRead = action == 'read',

            filters = isRead && operation.getFilters(),
            filtersLength = (filters && filters.length) || 0,
            filterIndex = 0,
            filter,

            params = this.callParent(arguments);

        // write filters
        for (; filterIndex < filtersLength; filterIndex++) {
            filter = filters[filterIndex];

            if (filter.getOperator()) {
                Ext.Error.raise('Filter operators are not currently supported on the sparkpoints proxy');
            }

            params[filter.getProperty()] = filter.getValue();
        }

        return params;
    },
});