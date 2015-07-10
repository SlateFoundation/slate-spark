/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('MatchbookStudent.Application', {
    extend: 'Ext.app.Application',

    name: 'MatchbookStudent',

    requires: [
        //'MatchbookStudent.view.Main'
    ],

    controllers: [
        'MatchbookStudent.controller.Navigation',
        'MatchbookStudent.controller.Main',
        'MatchbookStudent.controller.Tracker'
    ],

    launch: function () {
        if (Ext.getVersion()) {
            console.log('Application launch.  Ext JS version: '+Ext.getVersion().version);
        }
        Ext.create('MatchbookStudent.view.Main',{
            renderTo: 'matchbook-student-application'
        });
    }
});
