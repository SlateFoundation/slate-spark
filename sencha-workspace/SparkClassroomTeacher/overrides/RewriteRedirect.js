Ext.define('Jarvus.routing.RewriteRedirect', {
    override: 'Ext.app.BaseController',
    
    redirectTo: function(token) {
        var recognized = Ext.app.route.Router.recognize(token),
            route = recognized && recognized.route,
            controller = route && route.controller,
            rewrite = route && route.rewrite;

        if (rewrite) {
            if (Ext.isString(rewrite)) {
                rewrite = route.rewrite = controller[rewrite];
            }

            token = rewrite.apply(controller, [token, recognized.args.args, route]) || token;
        }

        return this.callParent([token]);
    }
});