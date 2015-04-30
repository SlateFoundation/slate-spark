/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.Application', {
    requires: [
        'Spark2Manager.view.Main',
        'Emergence.util.API',
        'Spark2Manager.Util',
        'Spark2Manager.store.Assessments',
        'Spark2Manager.store.AssessmentTypes',
        'Spark2Manager.store.Comments',
        'Spark2Manager.store.GradeLevels',
        'Spark2Manager.store.Links',
        'Spark2Manager.store.Ratings',
        'Spark2Manager.store.Standards',
        'Spark2Manager.store.StandardCodes',
        'Spark2Manager.store.StandardMappings',
        'Spark2Manager.store.StandardRefs',
        'Spark2Manager.store.Tags',
        'Spark2Manager.store.TagMaps',
        'Spark2Manager.store.Vendors',
        'Spark2Manager.store.VendorDomains'

    ],

    extend: 'Ext.app.Application',
    
    name: 'Spark2Manager',

    controllers: [
        'Learn',
        'Conference',
        'Apply'
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
        'StandardCodes',
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

        // TODO: Remove this before production
        if (location.hostname.indexOf('slate.ninja') === -1) {
            Emergence.util.API.setHostname('slate.ninja');
        }

        Ext.StoreMgr.requireLoaded(['Vendors', 'VendorDomains', 'StandardCodes'], function() {
            var mainView = me.getMainView().create({
                    plugins: 'viewport'
                }),
                tab = mainView.child('#' + me.getDefaultToken() + '-panel');

            if (tab) {
                mainView.setActiveItem(tab);
            }
        });
    }
});
