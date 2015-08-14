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
                active: true
            },
            {
                title: 'Conference <div class="spark-tab-timer">1h</div>'
            },
            {
                title: 'Apply <div class="spark-tab-timer">1h</div>'
            },
            {
                title: 'Assess <div class="spark-tab-timer">1h</div>'
            }
        ]
    }
});