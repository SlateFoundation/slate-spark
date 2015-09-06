/**
 * Add beforeroute app event that can be cancelled to rewrite and/or asynchronously resume route handling
 */
Ext.define('Jarvus.routing.PreprocessRoute', {
    override: 'Ext.app.route.Router',

    onStateChange: function (token) {
        var me = this,
            thisMethod = arguments.callee,
            resume = function(newToken) {
                thisMethod.$owner.prototype[thisMethod.$name].call(me, Ext.isEmpty(newToken, true) ? token : newToken);
            };

        if (false !== me.application.fireEvent('beforeroute', token, resume)) {
            me.callParent([token]);
        }
    }
});