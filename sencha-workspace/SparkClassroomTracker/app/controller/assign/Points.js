/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.assign.Points', {
    extend: 'Ext.app.Controller',

    config: {
        activeTab: null
    },
    views: [
        'assign.points.learn.Main',
        'assign.points.conference.ResourceGrid',
        'assign.points.conference.QuestionGrid',
        'assign.points.apply.Main',
        'assign.points.assess.Grid'
    ],
    refs:{
        pointsTabbar: 'spark-assign-points-tabbar',
        learnCt: {
            selector: 'spark-assign-points-learn',
            autoCreate: true,

            xtype: 'spark-assign-points-learn'
        },
        conferenceResourceGrid: {
            selector: 'spark-assign-points-conference-resourcegrid',
            autoCreate: true,

            xtype: 'spark-assign-points-conference-resourcegrid'
        },
        conferenceQuestionGrid: {
            selector: 'spark-assign-points-conference-questiongrid',
            autoCreate: true,

            xtype: 'spark-assign-points-conference-questiongrid'
        },
        applyCt: {
            selector: 'spark-assign-points-apply',
            autoCreate: true,

            xtype: 'spark-assign-points-apply'
        },
        assessGrid: {
            selector: 'spark-assign-points-assess-grid',
            autoCreate: true,

            xtype: 'spark-assign-points-assess-grid'
        }
    },

    control: {
        'spark-assign-points-tabbar': {
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
            case 'resourcegrid':
                tab = me.getConferenceResourceGrid();
                break;
            case 'questiongrid':
                tab = me.getConferenceQuestionGrid();
                break;
            case 'apply':
                tab = me.getApplyCt();
                break;
            case 'assess':
                tab = me.getAssessGrid();
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