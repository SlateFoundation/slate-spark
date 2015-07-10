/**
 * This class is the main view for the application.
 */
Ext.define('MatchbookStudent.view.Main', {
    extend: 'Ext.container.Container',
    xtype: 'main',

    requires: [
        'MatchbookStudent.view.header.Main',
        'MatchbookStudent.view.header.Navigation',
        'MatchbookStudent.view.tracker.Frame'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    // TODO: replace with SASS
    style: {
        backgroundColor: 'white'
    },

    items: [{
        xtype: 'container',
        html: 'Application Title Container (Matchbook Logo, background image, no dynamic content)',

        // TODO: replace with SASS
        style: {
            padding: '2px 24px 32px'
        }
    },{
        xtype: 'header-main',

        // TODO: replace with SASS
        style: {
            padding: '8px 24px 8px'
        }
    },{
        xtype: 'header-navigation',

        // TODO: replace with SASS
        style: {
            padding: '8px 24px 8px'
        }
    },{
        xtype: 'tracker-frame',

        // TODO: replace with SASS
        style: {
            padding: '8px 24px 8px'
        }
    }]
});
