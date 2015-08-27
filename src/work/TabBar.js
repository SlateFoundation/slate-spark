/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-work-tabbar',
    cls: 'spark-work-tabbar',

    config: {
        tabType: 'mainTab',

        defaults: {
            flex: 1
        },

        items: [
            {
                // TODO: dynamic timers, and left icons
                // TODO: squash custom section after confirming it's not used anywhere in SparkClassroom
                title: 'Learn &amp; Practice <div class="spark-tab-timer">1h</div>',
                itemId: 'learn',
                section: 'learn'
            },
            {
                title: 'Conference <div class="spark-tab-timer">1h</div>',
                itemId: 'conference',
                section: 'conference'
            },
            {
                title: 'Apply <div class="spark-tab-timer">1h</div>',
                itemId: 'apply',
                section: 'apply'
            },
            {
                title: 'Assess <div class="spark-tab-timer">1h</div>',
                itemId: 'assess',
                section: 'assess'
            }
        ]
    }
});