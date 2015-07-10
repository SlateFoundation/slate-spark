/**
 * This class is the controller for the Tracker pages
 */
Ext.define('MatchbookStudent.controller.Tracker', {
    extend: 'Ext.app.Controller',

    stores: [
        'Learns',
        'LearnRatings'
    ],

    views: [
        'MatchbookStudent.view.tracker.Frame',
        'MatchbookStudent.view.tracker.learn.Main',
        'MatchbookStudent.view.tracker.learn.Header',
        'MatchbookStudent.view.tracker.learn.Grid',
        'MatchbookStudent.view.tracker.conference.Main',
        'MatchbookStudent.view.tracker.apply.Main',
        'MatchbookStudent.view.tracker.assess.Main',
        'MatchbookStudent.view.tracker.assess.LearnGrid'
    ],

    init: function() {
        var me = this;

        me.control({
            'tracker-learn-grid': {
                render: me.setStoreHack
            },
            'tracker-assess-learngrid': {
                render: me.setAssessStoreHack
            }
        });
    },

    // HACK: grid is being created before store, worry about it later
    setStoreHack: function(grid) {
        console.log(grid.getStore().storeId);
        grid.setStore('Learns');
    },
    // HACK: grid is being created before store, worry about it later
    setAssessStoreHack: function(grid) {
        console.log(grid.store.storeId);
        grid.setStore('LearnRatings');
    }
});
