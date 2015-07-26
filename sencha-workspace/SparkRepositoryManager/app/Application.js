/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'SparkRepositoryManager.API',

        // framework features
        'Ext.state.LocalStorageProvider',

        'SparkRepositoryManager.overrides.grid.RowEditor'
    ],

    name: 'SparkRepositoryManager',

    controllers: [
        'Analytics',

        'Viewport',

        'Learn',
        'Conference',
        'Resource',
        'Apply',
        'Assess',
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