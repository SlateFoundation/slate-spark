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
        },
        {
            xtype: 's2m-pbl-panel',
            title: 'PBL',
            itemId: 'pbl-panel',
            disabled: true
        }
    ],

    listeners: {
        tabchange: function(tabPanel, tab) {
            Ext.History.add(tab.getItemId().replace('-panel', ''));
        }
    }
});
