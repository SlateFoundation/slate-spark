/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Work', {
    extend: 'Ext.app.Controller',

    views: [
        'work.Container',
        'work.learn.Container',
        'work.apply.Container',
        'work.assess.Container',
        'work.conference.Container'
    ],

    stores: [
        'apply.Tasks'
    ],

    refs: {
        tabsCt: 'spark-teacher-tabscontainer',
        workTabbar: 'spark-work-tabbar',
        workCt: {
            selector: 'spark-teacher-work-ct',
            autoCreate: true,

            xtype: 'spark-teacher-work-ct'
        },
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
        }
    },

    control: {
        workTabbar: {
            activetabchange: 'onWorkTabChange'
        }
    },

    routes: {
        'work': {
            rewrite: 'rewriteShowContainer'
        },
        'work/learn': 'showLearn',
        'work/conference': 'showConference',
        'work/apply': 'showApply',
        'work/assess': 'showAssess'
    },


    // route handlers
    rewriteShowContainer: function(token, args, route) {
        var workTabBar = this.getWorkTabbar(),
            workTabId = 'learn';

        if (workTabBar) {
            // TODO: verify this works when the tab bar exists
            workTabId = workTabBar.getActiveItem().getItemId();
        }

        return 'work/' + workTabId;
    },

    showLearn: function() {
        this.doShowContainer();
        this.doHighlightTabbars();
        this.doShowLearnContainer();
    },

    showConference: function() {
        this.doShowContainer();
        this.doHighlightTabbars();
        this.doShowConferenceContainer();
    },

    showApply: function() {
        this.doShowContainer();
        this.doHighlightTabbars();
        this.doShowApplyContainer();
    },

    showAssess: function() {
        this.doShowContainer();
        this.doHighlightTabbars();
        this.doShowAssessContainer();
    },

    // event handlers
    onWorkTabChange: function(tabbar){
        var me = this,
            section = tabbar.getActiveTab().section;

        switch(section){
            case 'learn':
                me.redirectTo('work/learn');
                break;
            case 'conference':
                me.redirectTo('work/conference');
                break;
            case 'apply':
                me.redirectTo('work/apply');
                break;
            case 'assess':
                me.redirectTo('work/assess');
                break;
        }
    },
    
    // controller methods
    /**
     * @private
     * Called by each subsection route handler to ensure container is activated
     */
    doShowContainer: function() {
        var tabsCt = this.getTabsCt();
        
        tabsCt.removeAll();
        tabsCt.add(this.getWorkCt());
    },

    /**
     * @private
     * Called by each subsection route handler to highlight the proper tab in the teacher
     * tabbar and the work tabbar
     */
    doHighlightTabbars: function(){

        //TODO: figure out a better way to highlight tab that doesn't trigger event

    },

    /**
     * @private
     * Called by each showLearn() to add the learnCt to the workCt
     */
    doShowLearnContainer: function() {
        var workCt = this.getWorkCt();
        
        workCt.removeAll();
        workCt.add(this.getLearnCt());
    },

    /**
     * @private
     * Called by each showConference() to add the conferenceCt to the workCt
     */
    doShowConferenceContainer: function() {
        var workCt = this.getWorkCt();
        
        workCt.removeAll();
        workCt.add(this.getConferenceCt());
    },

    /**
     * @private
     * Called by each showApply() to add the applyCt to the workCt
     */
    doShowApplyContainer: function() {
        var workCt = this.getWorkCt();
        
        workCt.removeAll();
        workCt.add(this.getApplyCt());
    },

    /**
     * @private
     * Called by each showAssess() to add the assessCt to the workCt
     */
    doShowAssessContainer: function() {
        var workCt = this.getWorkCt();
        
        workCt.removeAll();
        workCt.add(this.getAssessCt());
    }

});