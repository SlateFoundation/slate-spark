/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.Application', {
    requires: [
        'SparkRepositoryManager.API',

        // package features

        // framework features
        'Ext.Error',
        'Ext.data.StoreManager',
        'Ext.plugin.Viewport',
        'Ext.state.LocalStorageProvider',

        'SparkRepositoryManager.overrides.grid.RowEditor',
        'SparkRepositoryManager.proxy.Records',
        'SparkRepositoryManager.store.AssessmentTypes',
        'SparkRepositoryManager.store.Assessments',
        'SparkRepositoryManager.store.Comments',
        'SparkRepositoryManager.store.ConferenceResources',
        'SparkRepositoryManager.store.GradeLevels',
        'SparkRepositoryManager.store.Links',
        'SparkRepositoryManager.store.Ratings',
        'SparkRepositoryManager.store.StandardMappings',
        'SparkRepositoryManager.store.StandardRefs',
        'SparkRepositoryManager.store.Standards',
        'SparkRepositoryManager.store.StandardsTree',
        'SparkRepositoryManager.store.TagMaps',
        'SparkRepositoryManager.store.Tags',
        'SparkRepositoryManager.store.VendorDomains',
        'SparkRepositoryManager.store.Vendors',
        'SparkRepositoryManager.store.Jurisdictions'
    ],

    extend: 'Ext.app.Application',

    name: 'SparkRepositoryManager',

    controllers: [
        'Analytics',

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
        'VendorDomains',
        'Jurisdictions'
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
        var me = this;

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