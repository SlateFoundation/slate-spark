/**
 * Implement rewrite method for routes and add beforerewrite and beforeredirect app events that can be
 * cancelled to rewrite and/or asynchronously resume route handling
 */
Ext.define('Jarvus.routing.PreprocessRedirect', {
    override: 'Ext.app.BaseController',

    redirectTo: function(originalToken) {
        var me = this,
            thisMethod = arguments.callee,
            resumeRedirect = function(resumeToken) {
                thisMethod.$previous.call(me, resumeToken);
            },
            resumeRewrite = function(resumeToken) {
                var recognized = Ext.app.route.Router.recognize(originalToken),
                    route = recognized && recognized.route,
                    controller = route && route.controller,
                    rewrite = route && route.rewrite;

                if (resumeToken) {
                    if (Ext.isString(rewrite)) {
                        rewrite = route.rewrite = controller[rewrite];
                    }

                    resumeToken = rewrite.apply(controller, [resumeToken, recognized.args.args, route]);
                }

                if (false !== me.application.fireEvent('beforeredirect', resumeToken, resumeRedirect)) {
                    resumeRedirect(resumeToken);
                }
            };

        if (false !== me.application.fireEvent('beforerewrite', originalToken, resumeRewrite)) {
            resumeRewrite(originalToken);
        }
    }
});