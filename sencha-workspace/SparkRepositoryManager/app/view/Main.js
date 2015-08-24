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

    tabBar: {
        cls: 'spark-main-tabbar'
    },

    items: [
        {
            disabled: !location.search.match(/\Walltabs(\W|$)/),
            itemId: 'learn',

            xtype: 's2m-learn-panel',
            title: 'Learn & Practice'
        },
        {
            disabled: !location.search.match(/\Walltabs(\W|$)/),
            itemId: 'conference',

            xtype: 's2m-conference-panel',
            title: 'Conference Questions'
        },
        {
            disabled: !location.search.match(/\Walltabs(\W|$)/),
            itemId: 'resource',

            xtype: 's2m-resource-panel',
            title: 'Conference Resources'
        },
        {
            disabled: !location.search.match(/\Walltabs(\W|$)/),
            itemId: 'apply',

            xtype: 's2m-apply-panel',
            title: 'Apply'
        },
        {
            disabled: !location.search.match(/\Walltabs(\W|$)/),
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
    ]
});
