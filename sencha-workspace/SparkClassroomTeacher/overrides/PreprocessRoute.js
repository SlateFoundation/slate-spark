/**
 * Add beforeroute app event that can be cancelled to rewrite and/or asynchronously resume route handling
 */
Ext.define('Jarvus.routing.PreprocessRoute', {
    override: 'Ext.app.route.Router',

    onStateChange: function (originalToken) {
        var me = this,
            thisMethod = arguments.callee,
            resume = function(resumeToken) {
                resumeToken = Ext.isEmpty(resumeToken, true) ? originalToken : resumeToken;

                var recognized = me.recognize(resumeToken),
                    route = recognized && recognized.route,
                    controller = route && route.controller,
                    rewrite = route && route.rewrite,
                    rewriteToken;

                if (rewrite) {
                    if (Ext.isString(rewrite)) {
                        rewrite = route.rewrite = controller[rewrite];
                    }

                    rewriteToken = rewrite.apply(controller, [resumeToken, recognized.args.args, route]);

                    if (Ext.isEmpty(rewriteToken, true)) {
                        rewriteToken = resumeToken;
                    }
                }

                thisMethod.$owner.prototype[thisMethod.$name].call(me, rewriteToken);
            };

        if (false !== me.application.fireEvent('beforeroute', originalToken, resume)) {
            resume(originalToken);
        }
    }
});