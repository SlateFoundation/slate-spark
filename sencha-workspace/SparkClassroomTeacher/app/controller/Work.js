/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Work', {
    extend: 'Ext.app.Controller',

    config: {
        activeTab: null
    },

    refs:{
        workMainCt: 'spark-work',
        learnCt: {
            selector: 'spark-work-learn',
            autoCreate: true,

            xtype: 'spark-work-learn'
        },
        conferenceCt: {
            selector: 'spark-work-conference',
            autoCreate: true,

            xtype: 'spark-work-conference'
        },
        applyCt: {
            selector: 'spark-work-apply',
            autoCreate: true,

            xtype: 'spark-work-apply'
        },
        assessCt: {
            selector: 'spark-work-assess',
            autoCreate: true,

            xtype: 'spark-work-assess'
        }
    },

    control: {
        'spark-work tabbar': {
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

    onTabChange: function(tabBar, newTab, oldTab) {
        this.setActiveTab(newTab.config.section);
    }
});