/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.proxy.StandardDocuments', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.spark-standarddocuments',

    headers: {
        //'Api-Key': 'K8HZDs8vghUHeH6k6DFKLqHj'
        // Key for bc.local origin:
        'Api-Key': 'ohGxNubKWX5MVtwuPeX22pQY'
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
