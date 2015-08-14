/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-work-tabbar',
    cls: 'spark-work-tabbar',

    config: {
        defaults: {
            flex: 1
        },

        items: [
            {
                // TODO: dynamic timers, and left icons
                title: 'Learn &amp; Practice <div class="spark-tab-timer">1h</div>',
                section: 'learn'
            },
            {
                title: 'Conference <div class="spark-tab-timer">1h</div>',
                section: 'conference'
            },
            {
                title: 'Apply <div class="spark-tab-timer">1h</div>',
                section: 'apply'
            },
            {
                title: 'Assess <div class="spark-tab-timer">1h</div>',
                section: 'assess'
            }
        ]
    }
});