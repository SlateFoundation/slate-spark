/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.proxy.Standards', {
    extend: 'SparkRepositoryManager.proxy.API',
    alias: 'proxy.spark-standards',

    config: {
        reader: {
            type: 'json',
            transform: function(data) {
                // TODO: remove when database order is repaired
                return data.reverse();
            }
        }
    },

    getUrl: function(request) {
        var node = request.getOperation().node,
            idParam = this.getIdParam(),
            params = request.getParams();

        if (node) {
            delete params[idParam];
            return '/standards/documents/'+node.getId()+'/children';
        }

        return this.callParent(arguments);
    }
});