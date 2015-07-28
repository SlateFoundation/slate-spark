/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',
 
    views: [
        'work.apply.Main',
        'work.learn.Main',
        'work.conference.Main',
        'work.assess.Main'   
    ],

    config: {
        activeTab: null
    },
    
    refs:{
        learnMainCt: {
            selector: 'spark-student-work-learn',
            autoCreate: true,

            xtype: 'spark-student-work-learn'
        },
        conferenceMainCt: {
            selector: 'spark-student-work-conference',
            autoCreate: true,

            xtype: 'spark-student-work-conference'
        },
        applyMainCt: {
            selector: 'spark-student-work-apply',
            autoCreate: true,

            xtype: 'spark-student-work-apply'
        },
        assessMainCt: {
            selector: 'spark-student-work-assess',
            autoCreate: true,

            xtype: 'spark-student-work-assess'
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