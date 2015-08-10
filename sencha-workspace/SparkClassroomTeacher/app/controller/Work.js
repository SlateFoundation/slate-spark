/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Work', {
    extend: 'Ext.app.Controller',
    
    views: [
        'work.apply.Main',
        'work.assess.Main',
        'work.learn.Main',
        'work.conference.Main'
    ],
    
    stores: [
        'apply.Tasks'
    ],
    
    config: {
        activeTab: null
    },

    refs:{
        workMainCt: 'spark-work',
        learnCt: {
            selector: 'spark-teacher-work-learn',
            autoCreate: true,

            xtype: 'spark-teacher-work-learn'
        },
        conferenceCt: {
            selector: 'spark-teacher-work-conference',
            autoCreate: true,

            xtype: 'spark-teacher-work-conference'
        },
        applyCt: {
            selector: 'spark-teacher-work-apply',
            autoCreate: true,

            xtype: 'spark-teacher-work-apply'
        },
        assessCt: {
            selector: 'spark-teacher-work-assess',
            autoCreate: true,

            xtype: 'spark-teacher-work-assess'
        },
        navTabBar: 'spark-work tabbar[tabType=mainTab]'
    },

    control: {
        navTabBar: {
            activetabchange: 'onTabChange'
        },
        'spark-work': {
            sectionclose: 'onSectionClose',
            show: 'onSparkWorkActivate',
            added: 'onSparkWorkActivate',
            viewselected: 'onViewSelected'
        },
        learnCt: {
            show: 'onLearnCtActivate',
            added: 'onLearnCtActivate'
        },
        conferenceCt: {
            show: 'onConferenceCtActivate',
            added: 'onConferenceCtActivate'
        },
        applyCt: {
            show: 'onApplyCtActivate',
            added: 'onApplyCtActivate'
        },
        assessCt: {
            show: 'onAssessCtActivate',
            added: 'onAssessCtActivate'
        }
    },
    
    onTabChange: function(tabBar, newTab, oldTab) {
        this.setActiveTab(newTab.config.section);
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
                tab = me.getLearnCt();
                break;
            case 'conference':
                tab = me.getConferenceCt();
                break;
            case 'apply':
                tab = me.getApplyCt();
                break;
            case 'assess':
                tab = me.getAssessCt();
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
    
    onViewSelected: function(view) {
        var tabBar = this.getNavTabBar();
        
        tabBar.setActiveTab(tabBar.down('[section='+view+']'));  
    },
    
    onSparkWorkActivate: function () {
        var tab = this.getActiveTab();
        
        if (tab) {
            tab.show();
        } else {
            this.redirectTo('work');
        }
    },
    
    onLearnCtActivate: function () {
        this.redirectTo('work/learn');
    },
    
    onConferenceCtActivate: function () {
        this.redirectTo('work/conference');
    },
    
    onApplyCtActivate: function () {
        this.redirectTo('work/apply');
    },
    
    onAssessCtActivate: function () {
        this.redirectTo('work/assess');
    },
    
    onSectionClose: function (tab) {
        var tab = this.getActiveTab();
        
        if (tab) {
            tab.hide();
        }
    }
});