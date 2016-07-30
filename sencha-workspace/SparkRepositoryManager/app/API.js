/*jslint browser: true ,undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.API', {
    extend: 'Emergence.util.AbstractAPI',
    singleton: true,

    getMetadata: function (url, extended, cb) {
        if (typeof extended !== 'function') {
            extended = !!extended;
        } else {
            cb = extended;
        }

        this.request({
            method: 'GET',
            url: '/spark2/metadata',
            success: cb,
            params: {
                url: url,
                extended: extended
            }
        });
    }
}, function(API) {
    var pageParams = Ext.Object.fromQueryString(location.search);

    // allow API host to be overridden via apiHost param
    if (pageParams.apiHost) {
        API.setHost(pageParams.apiHost);
        API.setUseSSL(true);
    }
});
