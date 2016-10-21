/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-work-tabbar',
    requires: [
        'SparkClassroom.work.Tab'
    ],


    config: {
        activePhase: null,

        cls: 'spark-work-tabbar',

        defaultType: 'spark-work-tab',

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
    },

    updateActivePhase: function(activePhase) {
        var tabs = this.getInnerItems(),
            tabsLen = tabs.length,
            i = 0, tab,
            activePhaseFound = false;

        for (; i < tabsLen; i++) {
            tab = tabs[i];

            if (activePhaseFound) {
                tab.removeCls(['spark-phase-complete', 'spark-phase-active', tab.getActiveCls()]);
                continue;
            }

            if (tab.getItemId() === activePhase) {
                activePhaseFound = true;
                tab.addCls('spark-phase-active');
                tab.addCls(tab.getActiveCls());
                tab.removeCls('spark-phase-complete');
                continue;
            }

            tab.addCls('spark-phase-complete');
            tab.removeCls('spark-phase-active');
            tab.removeCls(tab.getActiveCls());
        }
    }
});