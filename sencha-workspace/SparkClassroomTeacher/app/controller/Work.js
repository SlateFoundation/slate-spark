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
        navBar: 'spark-navbar',
        workNavButton: 'spark-navbar button#work',

        tabsCt: 'spark-teacher-tabscontainer',
        teacherTabbar: 'spark-teacher-tabbar',

        workCt: {
            selector: 'spark-teacher-work-ct',
            autoCreate: true,

            xtype: 'spark-teacher-work-ct'
        },
        workTabbar: 'spark-work-tabbar',

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
        workNavButton: {
            tap: 'onNavWorkTap'
        },
        workCt: {
            activate: 'onWorkCtActivate'
        },
        workTabbar: {
            activetabchange: 'onWorkTabChange'
        }
    },

    routes: {
        'work': {
            rewrite: 'rewriteShowWork'
        },
        'work/learn': 'showLearn',
        'work/conference': 'showConference',
        'work/apply': 'showApply',
        'work/assess': 'showAssess'
    },


    // route handlers
    rewriteShowWork: function(token, args, route) {
        var workTabBar = this.getWorkTabbar(),
            workTabId = 'learn';

        if (workTabBar) {
            workTabId = workTabBar.getActiveTab().getItemId();
        }

        return 'work/' + workTabId;
    },

    showLearn: function() {
        var workCt = this.getWorkCt();

        this.doShowContainer();
        this.doHighlightTabbars('learn');

        workCt.removeAll();
        workCt.add(this.getLearnCt());
    },

    showConference: function() {
        var workCt = this.getWorkCt();

        this.doShowContainer();
        this.doHighlightTabbars('conference');

        workCt.removeAll();
        workCt.add(this.getConferenceCt());
    },

    showApply: function() {
        var workCt = this.getWorkCt();

        this.doShowContainer();
        this.doHighlightTabbars('apply');

        workCt.removeAll();
        workCt.add(this.getApplyCt());
    },

    showAssess: function() {
        var workCt = this.getWorkCt();

        this.doShowContainer();
        this.doHighlightTabbars('assess');

        workCt.removeAll();
        workCt.add(this.getAssessCt());
    },

    // event handlers
    onNavWorkTap: function() {
        this.redirectTo('work');
    },

    onWorkCtActivate: function() {
        this.getNavBar().setSelectedButton(this.getWorkNavButton());
    },

    onWorkTabChange: function(tabbar, activeTab) {
        this.redirectTo('work/' + activeTab.getItemId());
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
     * tabbar and the assign tabbar
     */
    doHighlightTabbars: function(section) {
        var workTabbar = this.getWorkTabbar(),
            teacherTabbar = this.getTeacherTabbar(),
            teacherTab = teacherTabbar.down('#work'),
            assignTab = workTabbar.down('#'+ section);

        workTabbar.setActiveTab(assignTab);
        teacherTabbar.setActiveTab(teacherTab);
    }

});