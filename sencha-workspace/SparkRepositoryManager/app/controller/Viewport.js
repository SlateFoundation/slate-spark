/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.container.Viewport'
    ],


    // controller config
    views: [
        'Main'
    ],

    stores: [
        'Vendors',
        'VendorDomains',
        'StandardsTree',
        'AssessmentTypes'
    ],

    refs: [{
        ref: 'viewport',
        selector: 'viewport',
        autoCreate: true,

        xtype: 'viewport',
        layout: 'fit'
    }],


    // controller template methods
    onLaunch: function() {
        var me = this;

        Ext.StoreMgr.requireLoaded(['Vendors', 'VendorDomains', 'StandardsTree', 'AssessmentTypes'], function() {
            var viewport = me.getViewport();

            viewport.add({
                xtype: 'spark-main',
                activeTab: Ext.util.History.getToken()
            });
        });
    },


    // controller methods
    loadCard: function(card) {
        var ct = this.getCardCt(),
            layout = ct.getLayout();

        if(layout.getActiveItem() !== card) {
            layout.setActiveItem(card);
            ct.remove(layout.getPrev());
        }
    }
});