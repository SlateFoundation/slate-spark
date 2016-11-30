Ext.define('SparkClassroomStudent.controller.work.Learn', {
    extend: 'Ext.app.Controller',


    config: {
        studentSparkpoint: null
    },


    stores: [
        'work.Learns@SparkClassroom.store'
    ],

    refs: {
        learnCt: 'spark-student-work-learn',
        learnAccordian: 'spark-student-work-learn #learnAccordian',
        sparkpointCt: 'spark-student-work-learn #sparkpointCt',
        progressBanner: 'spark-work-learn-progressbanner',
        learnGrid: 'spark-work-learn-grid',
        readyBtn: 'spark-student-work-learn #readyForConferenceBtn',
        workCt: 'spark-student-work-ct'
    },

    control: {
        learnCt: {
            activate: 'onLearnCtActivate'
        },
        readyBtn: {
            tap: 'onReadyBtnTap'
        }
    },

    listen: {
        controller: {
            '#': {
                studentsparkpointload: 'onStudentSparkpointLoad',
                studentsparkpointupdate: 'onStudentSparkpointUpdate'
            }
        },
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

    // config handlers
    updateStudentSparkpoint: function(studentSparkpoint) {
        var me = this,
            learnsStore = me.getWorkLearnsStore(),
            sparkpointCt = me.getSparkpointCt(),
            learnAccordian = me.getLearnAccordian(),
            learnList = learnAccordian.down('list'),
            sparkpointCode = studentSparkpoint && studentSparkpoint.get('sparkpoint'),
            workCt = me.getWorkCt(),
            learnLists = [],
            groups, lesson, i;

        me.learnsCompleted = 0;
        me.learnsRequiredSection = null;
        me.learnsRequiredStudent = null;

        if (!studentSparkpoint) {
            return;
        }

        learnsStore.getProxy().setExtraParam('sparkpoint', sparkpointCode);
        learnsStore.load();

        if (sparkpointCt) {
            sparkpointCt.setTitle(sparkpointCode);
        }

        if (studentSparkpoint.get('is_lesson')) {
            learnAccordian.removeAll();

            lesson = workCt.applyLesson(studentSparkpoint.get('module_template'));
            groups = lesson.get('learn_groups');

            for (i = 0; i < groups.length; i++) {
                learnLists.push({
                    xtype: 'container',
                    expanded: true,
                    itemId: 'sparkpointCt',
                    title: groups[i].title,
                    items: [{
                        xtype: 'spark-work-learn-grid',
                        learnsRequired: groups[i].learns_required,
                        store: {
                            type: 'chained',
                            source: 'work.Learns',
                            filters: [{
                                property: 'lesson_group_id',
                                value: groups[i].id
                            }]
                        }
                    }]
                });
            }

            learnLists.push({
                xtype: 'container',
                expanded: true,
                itemId: 'sparkpointCt',
                title: 'Ungrouped',
                items: [{
                    xtype: 'spark-work-learn-grid',
                    store: {
                        type: 'chained',
                        source: 'work.Learns',
                        filters: [{
                            property: 'lesson_group_id',
                            value: null
                        }]
                    }
                }]
            });

            learnAccordian.add(learnLists);
            return;
        } else if (learnList && learnList.getStore() === learnsStore) {
            return;
        }

        learnAccordian.removeAll();
        learnAccordian.add({
            xtype: 'container',
            expanded: true,
            itemId: 'sparkpointCt',
            title: '[Select a Sparkpoint]',
            items: [{
                xtype: 'spark-work-learn-grid'
            }],
            store: 'work.Learns'
        });
    },


    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onStudentSparkpointUpdate: function() {
        this.refreshLearnProgress();
    },

    onLearnCtActivate: function(learnCt) {
        var me = this,
            studentSparkpoint = me.getStudentSparkpoint();

        // TODO set the title when we instantiate? me.getSparkpointCt().setTitle(studentSparkpoint ? studentSparkpoint.get('sparkpoint') : 'Loading&hellip;');
        me.refreshLearnProgress();
    },

    onLearnsStoreLoad: function(store, records, success) {
        var rawData = store.getProxy().getReader().rawData || {};

        this.refreshLearnProgress();
        this.ensureLearnPhaseStarted();

        if (success && rawData.module) { // TODO: change to lesson
            this.getWorkCt().setLesson(rawData.module);
        }
    },

    onLearnsStoreUpdate: function() {
        this.refreshLearnProgress();
        this.ensureLearnPhaseStarted();
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            itemData = data.item,
            studentSparkpoint, learn;

        if (table == 'learn_activity') {
            if (
                (studentSparkpoint = me.getStudentSparkpoint())
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
                },{
                    dirty: false
                });

                me.ensureLearnPhaseStarted();
            }
        } else if (table == 'learn_assignments_section') {
            if (
                (studentSparkpoint = me.getStudentSparkpoint())
                && itemData.sparkpoint_code == studentSparkpoint.get('sparkpoint')
                && itemData.section_code == studentSparkpoint.get('section_code')
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({section: itemData.assignment || null}, learn.get('assignments')));

                // TODO: remove this #hack when underlying #framework-bug gets fixed
                me.getLearnGrid().refresh();
            }
        } else if (table == 'learn_assignments_student') {
            if (
                (studentSparkpoint = me.getStudentSparkpoint())
                && itemData.student_id == studentSparkpoint.get('student_id')
                && itemData.sparkpoint_code == studentSparkpoint.get('sparkpoint')
                && itemData.section_code == studentSparkpoint.get('section_code')
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({student: itemData.assignment || null}, learn.get('assignments')));

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
            studentSparkpoint = me.getStudentSparkpoint();

        if (!studentSparkpoint.get('learn_completed_time')) {
            studentSparkpoint.set('learn_finish_time', new Date());
            studentSparkpoint.save();
            me.refreshLearnProgress();
        }

        me.redirectTo('work/conference');
    },


    // controller methods
    refreshLearnProgress: function() {
        var me = this,
            progressBanner = me.getProgressBanner(),
            readyBtn = me.getReadyBtn(),
            learns = me.getWorkLearnsStore().getRange(),
            count = learns.length,
            completed = 0,
            i = 0,
            rawData = me.getWorkLearnsStore().getProxy().getReader().rawData;

        if (!progressBanner || !readyBtn) {
            // learns tab hasn't been activated yet
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

    syncLearnsRequired: function() {
        var me = this,
            progressBanner = me.getProgressBanner(),
            readyBtn = me.getReadyBtn(),
            studentSparkpoint = me.getStudentSparkpoint(),
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
            learn, learnAssignments;

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
            if ((learnAssignments.section == 'required-first' || learnAssignments.student == 'required-first'
                || learnAssignments.section == 'required' || learnAssignments.student == 'required')) {
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

    ensureLearnPhaseStarted: function() {
        var studentSparkpoint = this.getStudentSparkpoint();

        // mark learn phase as started if any learn has been launched
        if (
            studentSparkpoint &&
            !studentSparkpoint.get('learn_start_time') &&
            this.getWorkLearnsStore().findExact('launched', true) != -1
        ) {
            studentSparkpoint.set('learn_start_time', new Date());
            studentSparkpoint.save();
        }
    }
});