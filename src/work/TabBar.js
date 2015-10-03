/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-work-tabbar',
    requires: [
        'SparkClassroom.work.Tab'
    ],


    config: {
        cls: 'spark-work-tabbar',

        defaultType: 'spark-work-tab',

        defaults: {
            flex: 1
        },

        items: [
            {
                itemId: 'learn',

                // TODO: left icons
                title: 'Learn &amp; Practice'
            },
            {
                itemId: 'conference',

                title: 'Conference'
            },
            {
                itemId: 'apply',

                title: 'Apply'
            },
            {
                itemId: 'assess',

                title: 'Assess'
            }
        ]
    }
});