/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.Application', {
    requires: [
        'Emergence.util.API',
        'Ext.Error',
        'Ext.data.StoreManager',
        'Ext.plugin.Viewport',
        'Spark2Manager.overrides.AbstractAPI',
        'Spark2Manager.overrides.grid.RowEditor',
        'Spark2Manager.store.AssessmentTypes',
        'Spark2Manager.store.Assessments',
        'Spark2Manager.store.Comments',
        'Spark2Manager.store.GradeLevels',
        'Spark2Manager.store.Links',
        'Spark2Manager.store.Ratings',
        'Spark2Manager.store.StandardMappings',
        'Spark2Manager.store.StandardRefs',
        'Spark2Manager.store.Standards',
        'Spark2Manager.store.StandardsTree',
        'Spark2Manager.store.TagMaps',
        'Spark2Manager.store.Tags',
        'Spark2Manager.store.VendorDomains',
        'Spark2Manager.store.Vendors'
    ],

    extend: 'Ext.app.Application',
    
    name: 'Spark2Manager',

    controllers: [
        'Learn',
        'Conference',
        'Apply',
        'Assess'
    ],

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    defaultToken : 'learn',

    // TODO: @themightychris this is a hack for routing to the tab panel, could use some help here
    onUnmatchedRoute: function(hash) {
        this.setDefaultToken(hash);
    },

    stores: [
        'Assessments',
        'AssessmentTypes',
        'Comments',
        'GradeLevels',
        'Links',
        'Ratings',
        'Standards',
        'StandardsTree',
        'StandardMappings',
        'StandardRefs',
        'Tags',
        'TagMaps',
        'Vendors',
        'VendorDomains'
    ],

    views: [
        'Main'
    ],

    launch: function () {
        var me = this;

        if (location.hostname !== 'localhost' && location.hostname !== 'slate.ninja') {
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            if (SiteEnvironment && SiteEnvironment.user && SiteEnvironment.user.Username) {
                ga('create', 'UA-63172269-1', { 'userId': SiteEnvironment.user.Username });
            } else {
                ga('create', 'UA-63172269-1', 'auto');
            }

            ga('send', 'pageview');

            Ext.Error.handle = function (err) {
                ga('send', 'exception', {
                    'exDescription': err.msg,
                    'exFatal':       true,
                    'appName':       err.sourceClass,
                    'appVersion':    err.sourceMethod
                });
            };
        }

        // TODO: Remove this before production
        if (location.hostname.indexOf('slate.ninja') === -1 && location.hostname.indexOf('slatepowered') === -1) {
            Emergence.util.API.setHostname('slate.ninja');
        }

        Ext.StoreMgr.requireLoaded(['Vendors', 'VendorDomains', 'StandardsTree', 'AssessmentTypes'], function() {
            var mainView = me.getMainView().create({
                    plugins: 'viewport'
                }),
                tab = mainView.child('#' + me.getDefaultToken() + '-panel');

            if (tab) {
                mainView.suspendEvent('tabchange');
                mainView.setActiveItem(tab);
                mainView.resumeEvent('tabchange');
            }
        });
    }
});
