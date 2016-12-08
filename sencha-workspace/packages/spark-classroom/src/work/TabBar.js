/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-work-tabbar',
    requires: [
        'SparkClassroom.work.Tab'
    ],


    config: {
        activePhase: null,
        completedPhases: {},

        cls: 'spark-work-tabbar',

        defaultType: 'spark-work-tab',

        items: [
            {
                itemId: 'learn',

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
            i = 0, tab;

        for (; i < tabsLen; i++) {
            tab = tabs[i];

            if (tab.getItemId() === activePhase) {
                tab.addCls('spark-phase-active');
            } else {
                tab.removeCls('spark-phase-active');
            }
        }
    },

    updateCompletedPhases: function(phases) {
        var me = this,
            tabs = me.getInnerItems(),
            i, tab, itemId;

        for (i = 0; i < tabs.length; i++) {
            tab = tabs[i];
            itemId = tab.getItemId();

            if (Ext.isObject(phases)
                && phases[itemId]
            ) {
                tab.addCls('spark-phase-complete');
            } else {
                tab.removeCls('spark-phase-complete');
            }
        }
    },

	/**
     * Resets tab.Bar to select the first item and remove extra classes for active/complete etc
     */
    resetToDefault: function() {
        var tabs = this.getInnerItems(),
            tabsLen = tabs.length,
            i = 0, tab;

        for (; i < tabsLen; i++) {
            tab = tabs[i];

            tab.removeCls('spark-phase-complete');
            tab.removeCls('spark-phase-active');

            if (i === 0) {
                this.setActiveTab(tab);
            }
        }
    }
});