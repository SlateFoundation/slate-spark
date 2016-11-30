Ext.define('SparkRepositoryManager.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'spark-main',
    requires: [
        'Ext.util.History',
        'SparkRepositoryManager.view.apply.Panel',
        'SparkRepositoryManager.view.assess.Panel',
        'SparkRepositoryManager.view.conference.Panel',
        'SparkRepositoryManager.view.learn.Panel',
        'SparkRepositoryManager.view.resource.Panel',
        'SparkRepositoryManager.view.sparkpoints.Panel',
        'SparkRepositoryManager.view.lessons.Panel'
    ],


    autoEl: 'main',
    componentCls: 'app-main',

    tabBar: {
        cls: 'spark-main-tabbar'
    },

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
        },
        {
            itemId: 'lessons',

            xtype: 's2m-lessons-panel',
            title: 'Lessons'
        }
    ]
});
