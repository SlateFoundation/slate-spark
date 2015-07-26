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

        'Viewport',

        'Learn',
        'Conference',
        'Apply',
        'Assess',
        'Resource',
        'Sparkpoints'
    ],

    // TODO: move all these to the controllers that actually use them
    stores: [
        'Assessments',
        'Comments',
        'GradeLevels',
        'Links',
        'Ratings',
        'Standards',
        'StandardMappings',
        'StandardRefs',
        'Tags',
        'TagMaps',
        'ConferenceResources',
        'Jurisdictions'
    ],

    init: function() {
        Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider', {
            prefix: 'srm-'
        }));
    }
});