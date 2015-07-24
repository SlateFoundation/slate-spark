/*jslint browser: true, undef: true *//*global Ext*/
/**
 * This class is meant to allow customization of Emergence.proxy.Records specific to
 * the SparkRepositoryManager application.
 *
 * It was created to reflect changes that had been made directly on Emergence.proxy.Records but may not
 * be compatible with other applications using Emergence.proxy.Records
 *
 * TODO: review the changes that were made to Emergence.proxy.Records.  If they improve the class without
 * the risk of breaking compatibility, they should be moved to the jarvus-emergence-apikit package.  If they may
 * break compatibility then they should be left in this class or possibly moved to the classes that use this proxy
 * and added as a config attribute (eg. filterParam)
 *
 */
Ext.define('SparkRepositoryManager.proxy.Jurisdictions', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.spark-jurisdictions',

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