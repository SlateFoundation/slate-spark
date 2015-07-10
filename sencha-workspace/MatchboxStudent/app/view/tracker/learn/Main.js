/**
 * This class is the learn page of the course tracker.
 */
Ext.define('MatchbookStudent.view.tracker.learn.Main', {
    extend: 'Ext.container.Container',
    xtype: 'tracker-learn-main',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'tracker-learn-header'
    },{
        xtype: 'tracker-learn-grid'
    },{
        // TODO: get rid of nesting and handle alignment/size with css/sass?
        xtype: 'container',
        layout: 'hbox',
        items: [{
            xtype: 'box',
            flex: 1
        },{
            xtype: 'button',
            text: 'I\'m ready for a Mastery Check'
        }]
    }]

});
