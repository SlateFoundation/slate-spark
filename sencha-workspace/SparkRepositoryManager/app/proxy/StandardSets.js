/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.proxy.StandardSets', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.spark-standardsets',

    headers: {
        'Api-Key': 'K8HZDs8vghUHeH6k6DFKLqHj'
    },

    reader: {
        type: 'json',
        rootProperty: 'data'
    },

    buildUrl: function(request) {
        var me = this,
            node = request.getOperation().node,
            url = me.getUrl(),
            params = request.getParams();

        delete params[me.getIdParam()];

        if (!node.isRoot()) {
            url += '/' + node.getId();
        }

        return url;
    }
});