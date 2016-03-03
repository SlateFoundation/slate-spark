/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
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

    config: {
        activeStudent: null
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

    listen: {
        controller: {
            '#': {
                activestudentselect: 'onActiveStudentSelect'
            }
        },
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


    // config handlers
    updateActiveStudent: function(activeStudent) {
        var me = this,
            feedbackStore = me.getWorkFeedbackStore(),
            studentId;

        me.redirectTo(activeStudent ? ['work', activeStudent.get('active_phase')] : 'gps');

        if (activeStudent) {
            studentId = activeStudent.getId();

            feedbackStore.setFilters([{
                property: 'student_id',
                value: studentId
            },{
                property: 'sparkpoint_id',
                value: activeStudent.get('sparkpoint_id')
            }]);

            feedbackStore.getProxy().setExtraParams({
                student_id: studentId,
                sparkpoint: activeStudent.get('sparkpoint')
            });

            feedbackStore.load();
        }
    },


    // event handlers
    onNavWorkTap: function() {
        this.redirectTo('work');
    },

    onWorkCtActivate: function() {
        this.getNavBar().setSelectedButton(this.getWorkNavButton());
    },

    onWorkTabChange: function(tabbar, activeTab) {
        this.redirectTo(['work', activeTab.getItemId()]);
    },

    onActiveStudentSelect: function(activeStudent) {
        var me = this;

        me.setActiveStudent(activeStudent);
        me.redirectTo(['work', activeStudent.get('active_phase')]);
    },

    onSocketData: function(socket, data) {
        var me = this,
            tableName = data.table,
            itemData = data.item,
            activeStudent, workFeedbackStore, doLoadFeedback;

        if (tableName == 'teacher_feedback') {
            if (
                (activeStudent = me.getActiveStudent()) &&
                activeStudent.getId() == itemData.student_id &&
                activeStudent.get('sparkpoint_id') == itemData.sparkpoint_id
            ) {
                workFeedbackStore = me.getWorkFeedbackStore();

                doLoadFeedback = function() {
                    var sameAuthorFeedback, newFeedback;

                    if (!workFeedbackStore.getById(itemData.id)) {
                        sameAuthorFeedback = workFeedbackStore.findRecord('author_id', itemData.author_id);

                        newFeedback = workFeedbackStore.add(Ext.apply({
                            author_name: sameAuthorFeedback ? sameAuthorFeedback.get('author_name') : null
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
        var me = this,
            workTabbar = me.getWorkTabbar(),
            teacherTabbar = me.getTeacherTabbar(),
            teacherTab = teacherTabbar.down('#work'),
            assignTab = workTabbar.down('#'+ section);

        workTabbar.setActiveTab(assignTab);
        teacherTabbar.setActiveTab(teacherTab);
    }
});