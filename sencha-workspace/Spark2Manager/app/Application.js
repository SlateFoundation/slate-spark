/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('Spark2Manager.Application', {
    requires: [
'Emergence.util.API'
],
requires: 'Emergence.util.API',

    extend: 'Ext.app.Application',
    
    name: 'Spark2Manager',

    controllers: [
        'Learn'
    ],
    
    init: function () {
        // TODO: @themightychris said that there is a better way to do this
        Emergence.util.API.setHostname('spark2-manager.dev.jeffreymealo.com');
    }
});
