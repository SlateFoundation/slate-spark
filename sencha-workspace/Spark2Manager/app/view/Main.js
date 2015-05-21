Ext.define('Spark2Manager.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Spark2Manager.view.apply.Panel',
        'Spark2Manager.view.learn.Panel',
        'Spark2Manager.view.conference.Panel',
        'Spark2Manager.view.assess.Panel',
        'Spark2Manager.view.pbl.Panel',
        'Ext.util.History'
    ],

    alias: 'mainview',
    reference: 'mainview',
    autoCreate: true,

    items: [
        {
            xtype: 's2m-learn-panel',
            title: 'Learn & Practice',
            itemId: 'learn-panel'
        },
        {
            xtype: 's2m-conference-panel',
            title: 'Conference',
            itemId: 'conference-panel'
        },
        {
            xtype: 's2m-apply-panel',
            title: 'Apply',
            itemId: 'apply-panel'
        },
        {
            xtype: 's2m-assess-panel',
            title: 'Assess',
            itemId: 'assess-panel'
        }/*,
        {
            xtype: 's2m-pbl-panel',
            title: 'PBL',
            itemId: 'pbl-panel',
            disabled: true
        }*/
    ],

    listeners: {
        beforetabchange: function(tabPanel, tab, oldTab) {
            var newGridPanel = tab.is('gridpanel') ? tab : tab.down('gridpanel'),
                oldGridPanel  = oldTab.is('gridpanel') ? oldTab : oldTab.down('gridpanel'),
                newFilters = [],
                oldFilters,
                newStore,
                newFields,
                oldGms = oldGridPanel.getPlugin('gms');

            if (newGridPanel && oldGridPanel) {
                newStore = newGridPanel.getStore();

                if (newStore) {
                    newFields =  Object.keys(newStore.getModel().getFieldsMap());
                    oldFilters = oldGridPanel.getStore().getFilters();

                    // Do not attempt to filter by fields that do not exist on the new tab
                    oldFilters.each(function(filter) {
                        var cfg = filter.getConfig(),
                            prop = cfg.property;

                        if (newFields.indexOf(prop) !== -1) {
                            newFilters.push(filter);
                        }
                    });

                    if (newFilters.length > 0) {
                        newStore.setFilters(newFilters);
                        oldGms.lastHeight = oldGms.getHeight();
                    }
                }
            }
        },

        tabchange: function(tabPanel, tab, oldTab) {
            var newGridPanel = tab.is('gridpanel') ? tab : tab.down('gridpanel'),
                oldGridPanel  = oldTab.is('gridpanel') ? oldTab : oldTab.down('gridpanel'),
                oldGms = oldGridPanel.getPlugin('gms'),
                gms = newGridPanel.getPlugin('gms'),
                hashbang = tab.getItemId().replace('-panel', '');

            window.setTimeout(function() {
                // HACK: gms handles drawing itself and does some weird stuff, this fixes an issue where the filter
                // row doesn't expand to the height of its children; defying normal extjs layout behavior
                gms.setHeight(oldGms.lastHeight);
            }, 10);

            Ext.History.add(hashbang);

            if (window.ga) {
                ga('set', {
                    page: '/#' + hashbang,
                    title: tab.getTitle()
                });

                ga('send', 'pageview');
            }
        }
    }
});
