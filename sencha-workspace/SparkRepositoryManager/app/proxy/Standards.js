/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.proxy.Standards', {
    extend: 'SparkRepositoryManager.proxy.API',
    alias: 'proxy.spark-standards',


    getUrl: function(request) {
        var node = request.getOperation().node,
            idParam = this.getIdParam(),
            params = request.getParams();

        if (node) {
            delete params[idParam];
            return '/spark-repo/standards-documents/'+node.getId()+'/children';
        }

        return this.callParent(arguments);
    }
});