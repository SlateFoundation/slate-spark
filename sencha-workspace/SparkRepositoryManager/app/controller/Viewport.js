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
        'StandardCodes',
        'AssessmentTypes'
    ],

    refs: [{
        ref: 'viewport',
        selector: 'viewport',
        autoCreate: true,

        xtype: 'viewport',
        layout: 'fit'
    }],

    control: {
        'spark-main': {
            beforetabchange: 'onBeforeTabChange',
            tabchange: 'onTabChange'
        }
    },

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
    },

    onBeforeTabChange: function(mainView, incomingTab, outgoingTab) {
        var me = this,
            lastFilters = me.lastFilters,
            fieldsMap, newFilters, incomingTabStore;

        // collect all filters from outgoing tab
        if (outgoingTab && outgoingTab.is('gridpanel')) {
            lastFilters = me.lastFilters = outgoingTab.getStore().getFilters().getRange();
        }

        // apply filters to incoming tab
        if (lastFilters && incomingTab.is('gridpanel')) {

            // remove filters for fields not present in the new model
            fieldsMap = incomingTab.getStore().getModel().getFieldsMap();
            newFilters = Ext.Array.filter(lastFilters, function(filter) {
                return filter.getProperty() in fieldsMap;
            });

            // setFilters with an empty array doesn't seem to clear the filters list, so handle separately
            incomingTabStore = incomingTab.getStore();
            if (newFilters.length) {
                incomingTabStore.setFilters(newFilters);
            } else {
                incomingTabStore.clearFilter();
            }
        }
    },

    onTabChange: function(mainView, incomingTab) {
        Ext.util.History.add(incomingTab.getItemId());
    }
});