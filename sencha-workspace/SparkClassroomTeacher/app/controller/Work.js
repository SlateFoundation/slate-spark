/* global SparkClassroom */
/**
 * The Work controller handles activating the top-level
 * "Work" tab and manages navigation between its immediate
 * subtabs for each learning phase
 *
 * ## Responsibilities
 * - Realize /work and /work/{phase} routes
 * - Ensure "Student Work" tab is selected in navbar and teacher tabs
 * when screen gets activated
 * - Instantiating and activating correct subsection for each subtab
 * on select
 * - Instantiating global feedback store and loading feedback for all phases
 * when a student is selected
 * - Updating global feedback store with realtime changes received from socket
 */
Ext.define('SparkClassroomTeacher.controller.Work', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkClassroom.timing.DurationDisplay'
    ],


    views: [
        'work.Container',
        'work.learn.Container',
        'work.apply.Container',
        'work.assess.Container',
        'work.conference.Container'
    ],

    stores: [
        'work.Feedback@SparkClassroom.store'
    ],

    models: [
        'Person@Slate.model.person'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
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
        learnTab: 'spark-work-tab#learn',
        conferenceTab: 'spark-work-tab#conference',
        applyTab: 'spark-work-tab#apply',
        assessTab: 'spark-work-tab#assess',

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
        appCt: {
            selectedstudentsparkpointchange: 'onSelectedStudentSparkpointChange'
        },
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
        socket: {
            data: 'onSocketData'
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
    rewriteShowWork: function() {
        var workTabBar = this.getWorkTabbar(),
            workTabId, activeWorkTab, selectedStudentSparkpoint;

        if (
            workTabBar
            && (activeWorkTab = workTabBar.getActiveTab())
        ) {
            workTabId = activeWorkTab.getItemId();
        } else if (selectedStudentSparkpoint = this.getAppCt().getSelectedStudentSparkpoint()) {  // eslint-disable-line no-cond-assign
            workTabId = selectedStudentSparkpoint.get('active_phase');
        }

        return 'work/' + (workTabId || 'learn');
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
    onSelectedStudentSparkpointChange: function(appCt, selectedStudentSparkpoint) {
        var me = this,
            activeTeacherTab = me.getTeacherTabbar().getActiveTab(),
            feedbackStore = me.getWorkFeedbackStore(),
            studentId;

        if (!activeTeacherTab || activeTeacherTab.getItemId() === 'work') {
            me.redirectTo(selectedStudentSparkpoint ? ['work', selectedStudentSparkpoint.get('active_phase')] : 'gps');
        }

        if (selectedStudentSparkpoint && !Ext.isArray(selectedStudentSparkpoint)) {
            studentId = selectedStudentSparkpoint.get('student_id');

            feedbackStore.setFilters([{
                property: 'student_id',
                value: studentId
            }, {
                property: 'sparkpoint_id',
                value: selectedStudentSparkpoint.get('sparkpoint_id')
            }]);

            feedbackStore.getProxy().setExtraParams({
                student_id: studentId, // eslint-disable-line camelcase
                sparkpoint: selectedStudentSparkpoint.get('sparkpoint')
            });

            feedbackStore.load();

            me.updateTabBar(selectedStudentSparkpoint);
        }
    },

    onNavWorkTap: function() {
        this.redirectTo('work');
    },

    onWorkCtActivate: function() {
        this.getNavBar().setSelectedButton(this.getWorkNavButton());
    },

    onWorkTabChange: function(tabbar, activeTab) {
        this.redirectTo(['work', activeTab.getItemId()]);
    },

    onSocketData: function(socket, data) {
        var me = this,
            tableName = data.table,
            itemData = data.item,
            selectedStudentSparkpoint, workFeedbackStore, doLoadFeedback;

        if (tableName === 'teacher_feedback') {
            if (
                (selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint())
                && selectedStudentSparkpoint.get('student_id') === itemData.student_id
                && selectedStudentSparkpoint.get('sparkpoint_id') === itemData.sparkpoint_id
            ) {
                workFeedbackStore = me.getWorkFeedbackStore();

                doLoadFeedback = function() {
                    var sameAuthorFeedback, newFeedback;

                    if (!workFeedbackStore.getById(itemData.id)) {
                        sameAuthorFeedback = workFeedbackStore.findRecord('author_id', itemData.author_id);

                        newFeedback = workFeedbackStore.add(Ext.apply({
                            author_name: sameAuthorFeedback ? sameAuthorFeedback.get('author_name') : null // eslint-disable-line camelcase
                        }, itemData))[0];

                        if (!sameAuthorFeedback) {
                            me.getPersonModel().load(newFeedback.get('author_id'), {
                                callback: function(author, operation, success) {
                                    if (success) {
                                        newFeedback.set('author_name', author.get('FullName'), { dirty: false });
                                    }
                                }
                            });
                        }
                    }
                };

                // if the socket event beats the POST response, the proxy will fail to when it tries to
                // realize the phantom record into one with an id that got slipped into the store already, so
                // avoid appending items to the store during a sync
                if (workFeedbackStore.isSyncing) {
                    workFeedbackStore.on('write', doLoadFeedback, me, { single: true });
                } else {
                    doLoadFeedback();
                }
            }
        }
    },


    // controller methods
    /**
     * @private
     * Called by each subsection route handler to ensure container is activated
     */
    doShowContainer: function() {
        var tabsCt = this.getTabsCt(),
            workCt = this.getWorkCt();

        if (!workCt.isPainted()) {
            tabsCt.removeAll();
            tabsCt.add(workCt);
        }
    },

    /**
     * @private
     * Called by each subsection route handler to highlight the proper tab in the teacher
     * tabbar and the assign tabbar
     */
    doHighlightTabbars: function(section) {
        var me = this,
            workTabbar = me.getWorkTabbar(),
            teacherTabbar = me.getTeacherTabbar(),
            teacherTab = teacherTabbar.down('#work'),
            assignTab = workTabbar.down('#'+ section);

        workTabbar.setActiveTab(assignTab);
        teacherTabbar.setActiveTab(teacherTab);
    },

    updateTabBar: function(studentSparkpoint) {
        var me = this,
            now = new Date(),
            sectionCode = studentSparkpoint.get('section_code') || me.getAppCt().getSelectedSection(),
            learnStartTime = studentSparkpoint.get('learn_start_time'),
            conferenceStartTime = studentSparkpoint.get('conference_start_time'),
            applyStartTime = studentSparkpoint.get('apply_start_time'),
            assessStartTime = studentSparkpoint.get('assess_start_time'),
            workTabbar = me.getWorkTabbar(),
            timing = SparkClassroom.timing.DurationDisplay;

        if (!workTabbar) {
            return;
        }

        /**
         * Duration calculations:
         * if no phase start time, leave it blank.
         * if calculateDuration returns blank (eg a case where phase is started and ended on a "day off"), show "0d"
         */
        me.getLearnTab().setDuration(
            learnStartTime
            && (timing.calculateDuration(sectionCode, learnStartTime, studentSparkpoint.get('learn_completed_time') || now) || '0d')
        );

        me.getConferenceTab().setDuration(
            conferenceStartTime
            && (timing.calculateDuration(sectionCode, conferenceStartTime, studentSparkpoint.get('conference_completed_time') || now) || '0d')
        );

        me.getApplyTab().setDuration(
            applyStartTime
            && (timing.calculateDuration(sectionCode, applyStartTime, studentSparkpoint.get('apply_completed_time') || now) || '0d')
        );

        me.getAssessTab().setDuration(
            assessStartTime
            && (timing.calculateDuration(sectionCode, assessStartTime, studentSparkpoint.get('assess_completed_time') || now) || '0d')
        );

        workTabbar.setActivePhase(studentSparkpoint.get('active_phase'));
    }
});
