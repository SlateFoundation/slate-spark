/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.History',
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
            var viewport = me.getViewport(),
                mainView = viewport.add({
                    xtype: 'spark-main',
                    activeTab: Ext.util.History.getToken()
                });

            Ext.util.History.on('change', function(token) {
                mainView.setActiveTab(token);
            });
        });
    }
});