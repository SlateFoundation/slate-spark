Ext.define('SparkRepositoryManager.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'spark-main',
    requires: [
        'Ext.util.History',
        'SparkRepositoryManager.view.apply.Panel',
        'SparkRepositoryManager.view.assess.Panel',
        'SparkRepositoryManager.view.conference.Panel',
        'SparkRepositoryManager.view.learn.Panel',
        'SparkRepositoryManager.view.pbl.Panel',
        'SparkRepositoryManager.view.resource.Panel',
        'SparkRepositoryManager.view.resource.Panel',
        'SparkRepositoryManager.view.sparkpoints.Panel'
    ],


    autoEl: 'main',
    componentCls: 'app-main',

    items: [
        {
            itemId: 'learn',

            xtype: 's2m-learn-panel',
            title: 'Learn & Practice'
        },
        {
            itemId: 'conference',

            xtype: 's2m-conference-panel',
            title: 'Conference Questions'
        },
        {
            itemId: 'resource',

            xtype: 's2m-resource-panel',
            title: 'Conference Resources'
        },
        {
            itemId: 'apply',

            xtype: 's2m-apply-panel',
            title: 'Apply'
        },
        {
            itemId: 'assess',

            xtype: 's2m-assess-panel',
            title: 'Assess'
        },
        {
            itemId: 'sparkpoints',

            xtype: 'srm-sparkpoints-panel',
            title: 'Sparkpoints'
        }/*,
        {
            xtype: 's2m-pbl-panel',
            title: 'PBL',
            itemId: 'pbl-panel',
            disabled: true
        }*/
    ],

    // TODO: move these listeners to the viewport controller
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
                gms = newGridPanel.getPlugin('gms');

            if (gms && oldGms) {
                window.setTimeout(function() {
                    // HACK: gms handles drawing itself and does some weird stuff, this fixes an issue where the filter
                    // row doesn't expand to the height of its children; defying normal extjs layout behavior
                    gms.setHeight(oldGms.lastHeight);
                }, 10);
            }

            Ext.History.add(tab.getItemId());
        }
    }
});
