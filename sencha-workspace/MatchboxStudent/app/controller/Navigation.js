/**
 * This class is the controller for the application navigation
 */
Ext.define('MatchbookStudent.controller.Navigation', {
    extend: 'Ext.app.Controller',

    stores: [
        'NavigationItems'
    ],

    views: [
        'MatchbookStudent.view.header.Navigation'
    ],

    refs: [{
        ref: 'tracker',
        selector: 'tracker-frame'
    },{
        ref: 'learn',
        selector: 'tracker-learn-main'
    },{
        ref: 'conference',
        selector: 'tracker-conference-main'
    },{
        ref: 'apply',
        selector: 'tracker-apply-main'
    },{
        ref: 'assess',
        selector: 'tracker-assess-main'
    }],

    routes: {
        'learn': 'showLearn',
        'conference': 'showConference',
        'apply': 'showApply',
        'assess': 'showAssess'
    },

    init: function() {
        var me = this;

        me.control({
            'header-navigation': {
                itemclick: me.onNavigationItemClicked
            }
        });
    },

    onNavigationItemClicked: function(view, record) {
        var path = record.get('path');

        Ext.util.History.pushState(path);
    },

    setActiveCard: function(card) {
        this.getTracker().getLayout().setActiveItem(card);
    },

    showLearn: function() {
        this.setActiveCard(this.getLearn());
    },

    showConference: function() {
        this.setActiveCard(this.getConference());
    },

    showApply: function() {
        this.setActiveCard(this.getApply());
    },

    showAssess: function() {
        this.setActiveCard(this.getAssess());
    }

});
