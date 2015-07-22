/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',

    config: {
        activeTab: null
    },
    views: [
        'work.Main',
        'assign.points.Main',
        'competencies.Main'
    ],
    refs:{
        workMainCt: {
            selector: 'spark-work',
            autoCreate: true,

            xtype: 'spark-work'
        },
        competenciesMainCt: {
            selector: 'spark-competencies',
            autoCreate: true,

            xtype: 'spark-competencies'
        },
        assignMainCt: {
            selector: 'spark-assign-points',
            autoCreate: true,

            xtype: 'spark-assign-points'
        }
    },

    control: {
        'viewport spark-tabbar': {
            activetabchange: 'onTabChange'
        }
    },

    applyActiveTab: function(tab) {
        var me = this,
            section;

        if (Ext.isString(tab)) {
            section = tab;
        } else if (tab.isXtype('button')) {
            section = tab.config.section;
        }

        switch(section) {
            case 'work':
                tab = me.getWorkMainCt();
                break;
            case 'competencies':
                tab = me.getCompetenciesMainCt();
                break;
            case 'assign':
                tab = me.getAssignMainCt();
                break;
        }

        return tab;
    },

    updateActiveTab: function(newTab, oldTab) {
        //initial load contains no tab
        if (oldTab) {
            oldTab.hide();
        }

        if(Ext.Viewport.down(newTab)) {
            newTab.show();
        } else {
            Ext.Viewport.add(newTab);
        }
    },

    onTabChange: function(tabBar, newTab, oldTab) {
        this.setActiveTab(newTab.config.section);
    }
});