/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.Application', {
    requires: [
        'SparkRepositoryManager.proxy.Records',
        'SparkRepositoryManager.overrides.grid.RowEditor',
        'SparkRepositoryManager.store.AssessmentTypes',
        'SparkRepositoryManager.store.Assessments',
        'SparkRepositoryManager.store.Comments',
        'SparkRepositoryManager.store.GradeLevels',
        'SparkRepositoryManager.store.Links',
        'SparkRepositoryManager.store.Ratings',
        'SparkRepositoryManager.store.StandardMappings',
        'SparkRepositoryManager.store.StandardRefs',
        'SparkRepositoryManager.store.Standards',
        'SparkRepositoryManager.store.StandardsTree',
        'SparkRepositoryManager.store.TagMaps',
        'SparkRepositoryManager.store.Tags',
        'SparkRepositoryManager.store.ConferenceResources',
        'SparkRepositoryManager.store.VendorDomains',
        'SparkRepositoryManager.store.Vendors',

        // package features
        'Emergence.util.API',

        // framework features
        'Ext.Error',
        'Ext.data.StoreManager',
        'Ext.plugin.Viewport',
        'Ext.state.LocalStorageProvider'
    ],

    extend: 'Ext.app.Application',

    name: 'SparkRepositoryManager',

    controllers: [
        'Learn',
        'Conference',
        'Apply',
        'Assess',
        'Resource',
        'Sparkpoints'
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
        'ConferenceResources',
        'Vendors',
        'VendorDomains'
    ],

    views: [
        'Main'
    ],

    init: function() {
        Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider', {
            prefix: 'srm-'
        }));
    },

    launch: function () {
        var me = this,
            pageParams = Ext.Object.fromQueryString(location.search);

        if (pageParams.apiHost) {
            Emergence.util.API.setHostname(pageParams.apiHost);
        } else {

            if (location.hostname.indexOf('matchbooklearning') !== -1) {
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
            if (location.hostname.indexOf('slate.ninja') === -1 &&
                location.hostname.indexOf('slatepowered') === -1 &&
                location.hostname.indexOf('matchbooklearning') === -1) {
                Emergence.util.API.setHostname('staging.sparkpoint.slatepowered.net');
            }
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
