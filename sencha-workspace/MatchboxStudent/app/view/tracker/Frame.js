/**
 * This class is the card layout container wiht the course tracker pages.
 */
Ext.define('MatchbookStudent.view.tracker.Frame', {
    extend: 'Ext.container.Container',
    xtype: 'tracker-frame',

    layout: 'card',

    activeItem: 3,

    items: [{
        xtype: 'tracker-learn-main'
    },{
        xtype: 'tracker-conference-main'
    },{
        xtype: 'tracker-apply-main'
    },{
        xtype: 'tracker-assess-main'
    }]

});
