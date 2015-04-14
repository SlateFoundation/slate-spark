Ext.define('Spark2Manager.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    requires: [
        'Spark2Manager.view.apply.Panel',
        'Spark2Manager.view.learn.Panel',
        'Spark2Manager.view.conference.Panel',
        'Spark2Manager.view.assess.Panel',
        'Spark2Manager.view.pbl.Panel'
    ],

    items: [
        {
            xtype: 's2m-learn-panel',
            title: 'Learn & Practice',
        },
        {
            xtype: 's2m-conference-panel',
            title: 'Conference',
        },
        {
            xtype: 's2m-apply-panel',
            title: 'Apply',
        },
        {
            xtype: 's2m-assess-panel',
            title: 'Assess',
        },
        {
            xtype: 's2m-pbl-panel',
            title: 'PBL',
            disabled: true
        }
    ]
});
