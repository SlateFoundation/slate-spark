Ext.define('SparkRepositoryManager.proxy.ContentAreas', {
    extend: 'Jarvus.proxy.Postgrest',
    alias: 'proxy.spark-contentareas',


    getParams: function(operation) {
        var params = this.callParent(arguments),
            node = operation.node;

        if (node && !node.get('root')) {
            // TODO: custom logic for expanding tree
        }

        return params;
    }
});