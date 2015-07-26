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
        'SparkRepositoryManager.proxy.Records'
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