/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkClassroom.view.work.learn.Main',
        'SparkClassroom.view.work.conference.Main'
    ],
    
    views: [
        'work.apply.Main',
        'work.assess.Main'
    ],

    config: {
        activeTab: null
    },
    
    refs:{
        learnMainCt: {
            selector: 'spark-work-learn',
            autoCreate: true,

            xtype: 'spark-work-learn'
        },
        conferenceMainCt: {
            selector: 'spark-work-conference',
            autoCreate: true,

            xtype: 'spark-work-conference'
        },
        applyMainCt: {
            selector: 'spark-work-apply',
            autoCreate: true,

            xtype: 'spark-work-apply'
        },
        assessMainCt: {
            selector: 'spark-work-assess',
            autoCreate: true,

            xtype: 'spark-work-assess'
        }
    },

    control: {
        'viewport spark-tabbar': {
            activetabchange: 'onTabChange'
        },
        'viewport': {
            add: 'onViewportAdd'
        }
    },
    
    onViewportAdd: function(viewport, view) {
          Ext.Array.each(view.query('[userClass]'), function(component) {
            component.setHidden(component.config.userClass != "Student");
        });
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