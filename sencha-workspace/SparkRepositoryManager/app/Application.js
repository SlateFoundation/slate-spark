/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'SparkRepositoryManager.API',

        // framework features
        'Ext.state.LocalStorageProvider',

        // app overrides
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

    init: function() {
        Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider', {
            prefix: 'srm-'
        }));
    }
});