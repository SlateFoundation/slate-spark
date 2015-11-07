/*jslint browser: true, undef: true, laxcomma:true, unused: true *//*global Ext*/
/**
 * TODO: move all work routing to main work controller
 */
Ext.define('SparkClassroomStudent.controller.Work', {
    extend: 'Ext.app.Controller',


    config: {
        studentSparkpoint: null
    },


    routes: {
        'work': {
            rewrite: 'rewriteWork'
        },
        'work/learn': 'showLearn',
        'work/conference': 'showConference',
        'work/apply': 'showApply',
        'work/assess': 'showAssess'
    },

    views: [
        'work.Container',
        'work.learn.Container',
        'work.apply.Container',
        'work.assess.Container',
        'work.conference.Container'
    ],

    refs: {
        navBar: 'spark-student-navbar',
        workNavButton: 'spark-student-navbar button#work',

        tabsCt: 'spark-student-tabscontainer',

        workCt: {
            selector: 'spark-student-work-ct',
            autoCreate: true,

            xtype: 'spark-student-work-ct'
        },
        workTabbar: 'spark-work-tabbar',
        learnTab: 'spark-work-tab#learn',
        conferenceTab: 'spark-work-tab#conference',
        applyTab: 'spark-work-tab#apply',
        assessTab: 'spark-work-tab#assess',

        learnCt: {
            selector: 'spark-student-work-learn',
            autoCreate: true,

            xtype: 'spark-student-work-learn'
        },
        conferenceCt: {
            selector: 'spark-student-work-conference',
            autoCreate: true,

            xtype: 'spark-student-work-conference'
        },
        applyCt: {
            selector: 'spark-student-work-apply',
            autoCreate: true,

            xtype: 'spark-student-work-apply'
        },
        assessCt: {
            selector: 'spark-student-work-assess',
            autoCreate: true,

            xtype: 'spark-student-work-assess'
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

    listen: {
        controller: {
            '#': {
                studentsparkpointload: 'onStudentSparkpointLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // route handlers
    rewriteWork: function() {
        var workTabBar = this.getWorkTabbar(),
            activeWorkTab = workTabBar && workTabBar.getActiveTab();

        return 'work/' + (activeWorkTab && activeWorkTab.getItemId() || 'learn');
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


    // config handlers
    updateStudentSparkpoint: function(studentSparkpoint) {
        if (studentSparkpoint) {
            this.refreshTabbar();
        }
    },


    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onNavWorkTap: function() {
        this.redirectTo('work');
    },

    onWorkCtActivate: function() {
        this.getNavBar().setSelectedButton(this.getWorkNavButton());
    },

    onWorkTabChange: function(tabbar, activeTab) {
        var me = this;

        me.redirectTo('work/' + activeTab.getItemId());
    },

    onSocketData: function(socket, data) {
        if (data.table != 'student_sparkpoint') {
            return;
        }

        var me = this,
            studentSparkpoint = me.getStudentSparkpoint(),
            itemData = data.item;

        if (
            studentSparkpoint &&
            studentSparkpoint.get('sparkpoint_id') == itemData.sparkpoint_id &&
            studentSparkpoint.get('student_id') == itemData.student_id
        ) {
            studentSparkpoint.set(itemData, { dirty: false });
            me.refreshTabbar();
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
     * tabbar and the assign tabbar
     */
    doHighlightTabbars: function(section) {
        var workTabbar = this.getWorkTabbar(),
            assignTab = workTabbar.down('#' + section);

        workTabbar.setActiveTab(assignTab);
    },

    refreshTabbar: function() {
        var me = this,
            now = new Date(),
            studentSparkpoint = me.getStudentSparkpoint(),
            learnStartTime = studentSparkpoint.get('learn_start_time'),
            conferenceStartTime = studentSparkpoint.get('conference_start_time'),
            applyStartTime = studentSparkpoint.get('apply_start_time'),
            assessStartTime = studentSparkpoint.get('assess_start_time');

        me.getLearnTab().setDuration(
            learnStartTime &&
            ((studentSparkpoint.get('learn_finish_time') || now) - learnStartTime) / 1000
        );

        me.getConferenceTab().setDuration(
            conferenceStartTime &&
            ((studentSparkpoint.get('conference_finish_time') || now) - conferenceStartTime) / 1000
        );

        me.getApplyTab().setDuration(
            applyStartTime &&
            ((studentSparkpoint.get('apply_finish_time') || now) - applyStartTime) / 1000
        );

        me.getAssessTab().setDuration(
            assessStartTime &&
            ((studentSparkpoint.get('assess_finish_time') || now) - assessStartTime) / 1000
        );

        me.getWorkTabbar().setActivePhase(studentSparkpoint.get('active_phase'));
    }
});