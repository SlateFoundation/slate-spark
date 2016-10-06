/* global SparkClassroom */
/**
 * TODO: move all work routing to main work controller
 */
Ext.define('SparkClassroomStudent.controller.Work', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkClassroom.timing.DurationDisplay'
    ],


    config: {
        selectedSection: null,
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

    stores: [
        'work.Feedback@SparkClassroom.store'
    ],

    models: [
        'Person@Slate.model.person'
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
                studentsparkpointload: 'onStudentSparkpointLoad',
                studentsparkpointupdate: 'onStudentSparkpointUpdate',
                sectionselect: 'onSectionSelect'
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
        var feedbackStore = this.getWorkFeedbackStore();

        if (studentSparkpoint) {
            this.refreshTabbar();

            feedbackStore.getProxy().setExtraParams({
                'student_id': studentSparkpoint.get('student_id'),
                'sparkpoint': studentSparkpoint.getId()
            });
            feedbackStore.load();
        }
    },


    // event handlers
    onSectionSelect: function(section) {
        this.setSelectedSection(section);
    },

    onStudentSparkpointLoad: function(studentSparkpoint) {
        var me = this;

        me.setStudentSparkpoint(studentSparkpoint);
        if (studentSparkpoint) {
            me.redirectTo(['work', studentSparkpoint.get('active_phase')]);
        }
    },

    onStudentSparkpointUpdate: function() {
        this.refreshTabbar();
    },

    onNavWorkTap: function() {
        this.redirectTo('work');
    },

    onWorkCtActivate: function() {
        this.getNavBar().setSelectedButton(this.getWorkNavButton());
    },

    onWorkTabChange: function(tabbar, activeTab) {
        var me = this;

        me.redirectTo(['work', activeTab.getItemId()]);
    },

    onSocketData: function(socket, data) {
        var me = this,
            tableName = data.table,
            itemData = data.item,
            studentSparkpoint = me.getStudentSparkpoint(),
            modifiedFieldNames,
            workFeedbackStore;

        if (tableName === 'student_sparkpoint' || tableName === 'section_student_active_sparkpoint') {
            if (studentSparkpoint
                && studentSparkpoint.get('sparkpoint_id') === itemData.sparkpoint_id
                && studentSparkpoint.get('student_id') === itemData.student_id) {
                modifiedFieldNames = studentSparkpoint.set(itemData, { dirty: false });
                me.getApplication().fireEvent('studentsparkpointupdate', studentSparkpoint, modifiedFieldNames)
            }
        } else if (tableName === 'teacher_feedback') {
            if (studentSparkpoint
                && studentSparkpoint.get('sparkpoint_id') === itemData.sparkpoint_id
                && studentSparkpoint.get('student_id') === itemData.student_id
                && (workFeedbackStore = me.getWorkFeedbackStore())
                && !workFeedbackStore.getById(itemData.id)
            ) {
                workFeedbackStore.add(itemData);
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
        var workTabbar = this.getWorkTabbar(),
            assignTab = workTabbar.down('#' + section);

        workTabbar.setActiveTab(assignTab);
    },

    refreshTabbar: function() {
        var me = this,
            studentSparkpoint = me.getStudentSparkpoint(),
            sectionCode = me.getSelectedSection(),
            workTabbar = me.getWorkTabbar();

        if (!workTabbar) {
            return;
        }

        me.getLearnTab().setDuration(
            SparkClassroom.timing.DurationDisplay.calculateDuration(
                sectionCode,
                studentSparkpoint.get('learn_start_time'),
                studentSparkpoint.get('learn_completed_time')
            )
        );

        me.getConferenceTab().setDuration(
            SparkClassroom.timing.DurationDisplay.calculateDuration(
                sectionCode,
                studentSparkpoint.get('conference_start_time'),
                studentSparkpoint.get('conference_completed_time')
            )
        );

        me.getApplyTab().setDuration(
            SparkClassroom.timing.DurationDisplay.calculateDuration(
                sectionCode,
                studentSparkpoint.get('apply_start_time'),
                studentSparkpoint.get('apply_completed_time')
            )
        );

        me.getAssessTab().setDuration(
            SparkClassroom.timing.DurationDisplay.calculateDuration(
                sectionCode,
                studentSparkpoint.get('assess_start_time'),
                studentSparkpoint.get('assess_completed_time')
            )
        );

        workTabbar.setActivePhase(studentSparkpoint.get('active_phase'));
    }
});
