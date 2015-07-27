/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkClassroom.view.work.learn.Main',
        'SparkClassroom.view.work.conference.Main',
        'SparkClassroom.view.work.apply.Main',
        'SparkClassroom.view.work.assess.Main',
    ],

    config: {
        activeTab: null
    },
    
    refs:{
        learnMainCt: {
            selector: 'spark-learn',
            autoCreate: true,

            xtype: 'spark-learn'
        },
        conferenceMainCt: {
            selector: 'spark-conference',
            autoCreate: true,

            xtype: 'spark-conference'
        },
        applyMainCt: {
            selector: 'spark-apply',
            autoCreate: true,

            xtype: 'spark-apply'
        },
        assessMainCt: {
            selector: 'spark-assess',
            autoCreate: true,

            xtype: 'spark-assess'
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
            case 'learn':
                tab = me.getLearnMainCt();
                break;
            case 'conference':
                tab = me.getConferenceMainCt();
                break;
            case 'apply':
                tab = me.getApplyMainCt();
                break;
            case 'assess':
                tab = me.getAssessMainCt();
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