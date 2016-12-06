Ext.define('SparkClassroomStudent.controller.work.Learn', {
    extend: 'Ext.app.Controller',


    stores: [
        'work.Learns@SparkClassroom.store'
    ],

    refs: {
        appCt: 'spark-student-appct',

        learnCt: 'spark-student-work-learn',
        sparkpointCt: 'spark-student-work-learn #sparkpointCt',
        progressBanner: 'spark-work-learn-progressbanner',
        lessonIntro: 'spark-work-learn #lessonIntro',
        learnGrid: 'spark-work-learn-grid',
        readyBtn: 'spark-student-work-learn #readyForConferenceBtn',
        workCt: 'spark-student-work-ct'
    },

    control: {
        appCt: {
            loadedstudentsparkpointchange: 'onLoadedStudentSparkpointChange',
            loadedstudentsparkpointupdate: 'onLoadedStudentSparkpointUpdate'
        },
        learnCt: {
            activate: 'onLearnCtActivate'
        },
        readyBtn: {
            tap: 'onReadyBtnTap'
        }
    },

    listen: {
        store: {
            '#work.Learns': {
                load: 'onLearnsStoreLoad',
                update: 'onLearnsStoreUpdate'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    learnsCompleted: 0,
    learnsRequiredSection: null,
    learnsRequiredStudent: null,

    // event handlers
    onLoadedStudentSparkpointChange: function(appCt, studentSparkpoint) {
        var me = this,
            learnsStore = me.getWorkLearnsStore(),
            learnCt = me.getLearnCt(),
            workCt = me.getWorkCt(),
            learnList = learnCt && learnCt.down('list'),
            lessonIntro = me.getLessonIntro(),
            sparkpointCode = studentSparkpoint && studentSparkpoint.get('sparkpoint'),
            lesson;

        me.learnsCompleted = 0;
        me.learnsRequiredSection = null;
        me.learnsRequiredStudent = null;

        if (!studentSparkpoint) {
            return;
        }

        learnsStore.getProxy().setExtraParam('sparkpoint', sparkpointCode);
        learnsStore.load();

        if (studentSparkpoint.get('is_lesson')) {
            // switching to a lesson
            workCt.setLesson(studentSparkpoint.get('lesson_template'));

            lesson = workCt.getLesson();
            lessonIntro.setData({
                title: lesson && lesson.get('title'),
                directions: lesson && lesson.get('directions')
            });
            lessonIntro.show();
            me.renderLessonLists(studentSparkpoint);
            return;
        } else if (learnCt && learnList && learnList.getStore() === learnsStore) {
            // switching to a regular sparkpoint from another regular sparkpoint
            learnList.setTitle(sparkpointCode);
            return;
        }

        // switching to a regular sparkpoint
        if (lessonIntro) {
            lessonIntro.hide();
        }

        learnCt.removeAll();
        learnCt.add([{
            title: sparkpointCode || '[Select a Sparkpoint]',
            store: 'work.Learns'
        }]);
    },

    onLoadedStudentSparkpointUpdate: function() {
        this.refreshLearnProgress();
    },

    onLearnCtActivate: function() {
        this.refreshLearnProgress();
    },

    onLearnsStoreLoad: function(store, records, success) {
        var rawData = store.getProxy().getReader().rawData || {};

        this.refreshLearnProgress();
        this.ensureLearnPhaseStarted();

        if (success && rawData.lesson) {
            this.getWorkCt().setLesson(rawData.lesson);
        }
    },

    onLearnsStoreUpdate: function() {
        this.refreshLearnProgress();
        this.ensureLearnPhaseStarted();
    },

    onSocketData: function(socket, data) { // eslint-disable-line complexity
        var me = this,
            table = data.table,
            itemData = data.item,
            studentSparkpoint, learn;

        if (table == 'learn_activity') {
            if (
                (studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint())
                && studentSparkpoint.get('student_id') == itemData.user_id
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {

                // TODO: can we find ways to not duplicate this logic between the api and the client?
                // Can there be an abstraction on the server side so that a higher-level event comes down
                // with a delta to the object as returned by the API previously so we can just pass the whole
                // data object to set?
                learn.set({
                    launched: itemData.start_status == 'launched',
                    completed: itemData.completed
                }, {
                    dirty: false
                });

                me.ensureLearnPhaseStarted();
            }
        } else if (table == 'learn_assignments_section') {
            if (
                (studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint())
                && itemData.sparkpoint_code == studentSparkpoint.get('sparkpoint')
                && itemData.section_code == studentSparkpoint.get('section_code')
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({ section: itemData.assignment || null }, learn.get('assignments')));

                // TODO: remove this #hack when underlying #framework-bug gets fixed
                me.getLearnGrid().refresh();
            }
        } else if (table == 'learn_assignments_student') {
            if (
                (studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint())
                && itemData.student_id == studentSparkpoint.get('student_id')
                && itemData.sparkpoint_code == studentSparkpoint.get('sparkpoint')
                && itemData.section_code == studentSparkpoint.get('section_code')
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({ student: itemData.assignment || null }, learn.get('assignments')));

                // TODO: remove this #hack when underlying #framework-bug gets fixed
                me.getLearnGrid().refresh();
            }
        } else if (table == 'learns_required_section') {
            me.learnsRequiredSection = itemData.required || null;
            me.syncLearnsRequired();
        } else if (table == 'learns_required_student') {
            me.learnsRequiredStudent = itemData.required || null;
            me.syncLearnsRequired();
        }
    },

    onReadyBtnTap: function() {
        var me = this,
            studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint();

        if (!studentSparkpoint.get('learn_completed_time')) {
            studentSparkpoint.set('learn_finish_time', new Date());
            studentSparkpoint.save();
            me.refreshLearnProgress();
        }

        me.redirectTo('work/conference');
    },


    // controller methods
    renderLessonLists: function() {
        var me = this,
            learnCt = me.getLearnCt(),
            workCt = me.getWorkCt(),
            learnLists = [],
            lesson = workCt.getLesson(),
            groups, group, i;

        learnCt.removeAll();

        groups = lesson && lesson.get('learn_groups') || [];

        for (i = 0; i < groups.length; i++) {
            group = groups[i];

            learnLists.push({
                title: group.title,
                groupId: group.id,
                store: {
                    type: 'chained',
                    source: 'work.Learns',
                    filters: [{
                        property: 'lesson_group_id',
                        value: group.id
                    }]
                }
            });
        }

        learnLists.push({
            title: 'Ungrouped',
            groupId: null,
            store: {
                type: 'chained',
                source: 'work.Learns',
                filters: [{
                    property: 'lesson_group_id',
                    value: null
                }]
            }
        });

        learnCt.add(learnLists);
    },

    refreshLearnProgress: function() {
        var me = this,
            progressBanner = me.getProgressBanner(),
            readyBtn = me.getReadyBtn(),
            learns = me.getWorkLearnsStore().getRange(),
            count = learns.length,
            completed = 0,
            i = 0,
            rawData = me.getWorkLearnsStore().getProxy().getReader().rawData,
            studentSparkpoint = me.getStudentSparkpoint(),
            isLesson = studentSparkpoint && studentSparkpoint.get('is_lesson');

        if (!progressBanner || !readyBtn) {
            // learns tab hasn't been activated yet
            return;
        }

        if (isLesson) {
            me.syncGroupedLearnsRequired();
            return;
        }

        if (rawData && rawData.learns_required) {
            if (me.learnsRequiredSection === null) {
                me.learnsRequiredSection = rawData.learns_required.section;
            }
            if (me.learnsRequiredStudent === null) {
                me.learnsRequiredStudent = rawData.learns_required.student;
            }
        }

        if (count) {
            for (; i < count; i++) {
                if (learns[i].get('completed')) {
                    completed++;
                }
            }

            me.learnsCompleted = completed;

            me.syncLearnsRequired();

            progressBanner.show();
        } else {
            progressBanner.hide();
        }
    },

    syncLearnsRequired: function() { // eslint-disable-line complexity
        var me = this,
            progressBanner = me.getProgressBanner(),
            readyBtn = me.getReadyBtn(),
            studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint(),
            learnFinishTime = studentSparkpoint && studentSparkpoint.get('learn_completed_time'),
            learnsStore = me.getWorkLearnsStore(),
            learns = learnsStore.getRange(),
            rawData = learnsStore.getProxy().getReader().rawData,
            count = learns.length,
            i = 0,
            learnsRequiredDisabled = false,
            minimumRequired = Math.min(count, 5),
            requiredLearns = 0,
            completedRequiredLearns = 0,
            isLesson = studentSparkpoint.get('is_lesson'),
            learn, learnAssignments;

        if (isLesson) {
            me.syncGroupedLearnsRequired();
            return;
        }

        if (rawData && rawData.learns_required && rawData.learns_required.site) {
            minimumRequired = Math.min(count, rawData.learns_required.site);
        }

        if (me.learnsRequiredStudent !== null) {
            minimumRequired = Math.min(count, me.learnsRequiredStudent);
        } else if (me.learnsRequiredSection !== null) {
            minimumRequired = Math.min(count, me.learnsRequiredSection);
        }

        for (; i < count; i++) {
            learn = learns[i];
            learnAssignments = learn.get('assignments');
            if (
                learnAssignments.section == 'required-first'
                || learnAssignments.student == 'required-first'
                || learnAssignments.section == 'required'
                || learnAssignments.student == 'required'
            ) {
                if (learn.get('completed')) {
                    completedRequiredLearns++;
                } else {
                    learnsRequiredDisabled = true;
                }
                requiredLearns++;
            }
        }

        if (!progressBanner || !readyBtn) {
            // learns tab hasn't been activated yet
            return;
        }

        progressBanner.setData({
            completedLearns: me.learnsCompleted,
            minimumLearns: minimumRequired,
            completedRequiredLearns: completedRequiredLearns,
            requiredLearns: requiredLearns,
            name: null
        });

        if (!learnsRequiredDisabled) {
            learnsRequiredDisabled = me.learnsCompleted < minimumRequired;
        }

        readyBtn.setDisabled(learnFinishTime || learnsRequiredDisabled);
        readyBtn.setText(learnFinishTime ? 'Conference Started': readyBtn.config.text);
    },

    syncGroupedLearnsRequired: function() {
        var me = this,
            learnCt = me.getLearnCt(),
            learnGrids = learnCt && learnCt.getInnerItems() || [],
            readyBtn = me.getReadyBtn(),
            studentSparkpoint = me.getStudentSparkpoint(),
            learnFinishTime = studentSparkpoint && studentSparkpoint.get('learn_completed_time'),
            lesson = me.getWorkCt().getLesson(),
            i, j, learns, grid, progressBanner, groupData, minimumRequired, learn, learnAssignments, completedRequiredLearns, learnsRequiredDisabled, requiredLearns, groupedLearnsCompleted;

        for (i = 0; i <learnGrids.length; i++) {
            grid = learnGrids[i];
            progressBanner = grid && grid.down('spark-work-learn-progressbanner');
            learns = grid && grid.getStore().getRange();
            groupData = lesson && lesson.getGroupData(grid && grid.groupId);
            completedRequiredLearns = 0;
            learnsRequiredDisabled = false;
            requiredLearns = 0;
            groupedLearnsCompleted = 0;

            if (learns.length && groupData) {
                progressBanner.show();
            } else {
                progressBanner.hide();
            }

            if (groupData && groupData.learns_required) {
                minimumRequired = Math.min(learns.length, groupData.learns_required); // TODO check prop
            }

            for (j = 0; j < learns.length; j++) {
                learn = learns[j];
                learnAssignments = learn.get('assignments');

                if (learns[j].get('completed')) {
                    groupedLearnsCompleted++;
                }

                if (
                    learnAssignments.section === 'required-first'
                    || learnAssignments.student === 'required-first'
                    || learnAssignments.section === 'required'
                    || learnAssignments.student === 'required'
                ) {
                    if (learn.get('completed')) {
                        completedRequiredLearns++;
                    } else {
                        learnsRequiredDisabled = true;
                    }
                    requiredLearns++;
                }
            }

            if (!progressBanner || !readyBtn) {
                // learns tab hasn't been activated yet
                return;
            }

            progressBanner.setData({
                completedLearns: groupedLearnsCompleted,
                minimumLearns: minimumRequired,
                completedRequiredLearns: completedRequiredLearns,
                requiredLearns: requiredLearns,
                name: null
            });

            if (!learnsRequiredDisabled) {
                learnsRequiredDisabled = me.learnsCompleted < minimumRequired;
            }

            readyBtn.setDisabled(learnFinishTime || learnsRequiredDisabled);
            readyBtn.setText(learnFinishTime ? 'Conference Started': readyBtn.config.text);
        }
    },

    ensureLearnPhaseStarted: function() {
        var studentSparkpoint = this.getAppCt().getLoadedStudentSparkpoint();

        // mark learn phase as started if any learn has been launched
        if (
            studentSparkpoint
            && !studentSparkpoint.get('learn_start_time')
            && this.getWorkLearnsStore().findExact('launched', true) != -1
        ) {
            studentSparkpoint.set('learn_start_time', new Date());
            studentSparkpoint.save();
        }
    }
});