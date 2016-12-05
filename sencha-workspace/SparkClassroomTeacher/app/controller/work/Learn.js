Ext.define('SparkClassroomTeacher.controller.work.Learn', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.DelayedTask'
    ],


    stores: [
        'work.Learns@SparkClassroom.store'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
        learnCt: 'spark-teacher-work-learn',
        sparkpointCt: 'spark-teacher-work-learn #sparkpointCt',
        progressBanner: 'spark-teacher-work-learn-sidebar spark-work-learn-progressbanner',
        learnGrid: 'spark-work-learn-grid',
        masteryCheckScoreField: 'spark-teacher-work-learn #masteryCheckScoreField',
        feedbackMessageField: 'spark-teacher-work-learn spark-teacher-feedbackform textareafield'
    },

    control: {
        appCt: {
            selectedstudentsparkpointchange: 'onSelectedStudentSparkpointChange'
        },
        learnCt: {
            activate: 'onLearnCtActivate'
        },
        masteryCheckScoreField: {
            change: 'onMasteryCheckScoreFieldChange'
        },
        'spark-teacher-work-learn spark-teacher-feedbackform button#sendBtn': {
            tap: 'onFeedbackSendTap'
        }
    },

    listen: {
        store: {
            '#StudentSparkpoints': {
                update: 'onStudentSparkpointsStoreUpdate'
            },
            '#work.Learns': {
                load: 'onLearnsStoreLoad',
                update: 'onLearnsStoreUpdate'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    learnsRequiredSection: null,
    learnsRequiredStudent: null,


    // controller template methods
    init: function() {
        var me = this;

        me.writeMasteryCheckScoreTask = new Ext.util.DelayedTask(me.writeMasteryCheckScore, me);
    },


    // event handlers
    onSelectedStudentSparkpointChange: function(appCt, selectedStudentSparkpoint) {
        var me = this,
            store = me.getWorkLearnsStore(),
            proxy = store.getProxy();

        if (selectedStudentSparkpoint) {
            // TODO: track dirty state of extraparams?
            proxy.setExtraParam('student_id', selectedStudentSparkpoint.get('student_id'));
            proxy.setExtraParam('sparkpoint', selectedStudentSparkpoint.get('sparkpoint'));

            if (store.isLoaded()) {
                store.load();
            }
        }

        me.syncSelectedStudentSparkpoint();
    },

    onLearnCtActivate: function() {
        this.syncSelectedStudentSparkpoint();
    },

    onStudentSparkpointsStoreUpdate: function(studentSparkpointsStore, studentSparkpoint, operation, modifiedFieldNames) {
        var me = this,
            scoreField;

        if (
            operation == 'edit'
            && studentSparkpoint === me.getAppCt().getSelectedStudentSparkpoint()
            && modifiedFieldNames.indexOf('learn_mastery_check_score') != -1
        ) {
            scoreField = me.getMasteryCheckScoreField();

            if (scoreField) {
                scoreField.setValue(studentSparkpoint.get('learn_mastery_check_score'));
                scoreField.resetOriginalValue();
            }
        }
    },

    onLearnsStoreLoad: function() {
        this.setLearnsRequired();
        this.refreshLearnProgress();
    },

    onLearnsStoreUpdate: function() {
        this.refreshLearnProgress();
    },

    onMasteryCheckScoreFieldChange: function() {
        this.writeMasteryCheckScoreTask.delay(500);
    },

    onFeedbackSendTap: function() {
        var selectedStudentSparkpoint = this.getAppCt().getSelectedStudentSparkpoint(),
            feedbackMessageField = this.getFeedbackMessageField(),
            message = (feedbackMessageField.getValue() || '').trim();

        if (!message) {
            Ext.Msg.alert('Feedback', 'Enter a message before sending feedback');
            return;
        }

        Ext.getStore('work.Feedback').add({
            'student_id': selectedStudentSparkpoint.get('student_id'),
            sparkpoint: selectedStudentSparkpoint.get('sparkpoint'),
            phase: 'learn',
            message: message
        });

        feedbackMessageField.reset();
    },

    onSocketData: function(socket, data) { // eslint-disable-line complexity
        var me = this,
            table = data.table,
            itemData = data.item,
            learnGrid = me.getLearnGrid(),
            selectedStudentSparkpoint, learn;

        if (table == 'learn_activity') {
            if (
                (selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint())
                && selectedStudentSparkpoint.get('student_id') == itemData.user_id
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
            }
        } else if (table == 'learn_assignments_section') {
            if (
                (selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint())
                && itemData.sparkpoint_code == selectedStudentSparkpoint.get('sparkpoint')
                && itemData.section_code == selectedStudentSparkpoint.get('section_code')
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({ section: itemData.assignment || null }, learn.get('assignments')));

                // TODO: remove this #hack when underlying #framework-bug gets fixed
                if (learnGrid) {
                    learnGrid.refresh();
                }
            }
        } else if (table == 'learn_assignments_student') {
            if (
                (selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint())
                && itemData.student_id == selectedStudentSparkpoint.get('student_id')
                && itemData.sparkpoint_code == selectedStudentSparkpoint.get('sparkpoint')
                && itemData.section_code == selectedStudentSparkpoint.get('section_code')
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({ student: itemData.assignment || null }, learn.get('assignments')));

                // TODO: remove this #hack when underlying #framework-bug gets fixed
                if (learnGrid) {
                    learnGrid.refresh();
                }
            }
        } else if (table == 'learns_required_section') {
            me.learnsRequiredSection = itemData.required || null;
            me.refreshLearnProgress();
        } else if (table == 'learns_required_student') {
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint();
            if (selectedStudentSparkpoint && selectedStudentSparkpoint.get('student_id') == itemData.student_id) {
                me.learnsRequiredStudent = itemData.required || null;
                me.refreshLearnProgress();
            }
        } else if (table == 'learn_reviews'
                && (selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint())
                && itemData.student_id == selectedStudentSparkpoint.get('student_id')
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
        ) {

            learn.set({
                comment: itemData.comment,
                rating: {
                    user: itemData.rating
                }
            }, { dirty: false });
        }
    },


    // controller methods
    syncSelectedStudentSparkpoint: function() {
        var me = this,
            learnCt = me.getLearnCt(),
            scoreField = me.getMasteryCheckScoreField(),
            store = me.getWorkLearnsStore(),
            proxy = store.getProxy(),
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint();

        if (!learnCt || !learnCt.hasParent()) {
            return;
        }

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        if (selectedStudentSparkpoint) {
            me.getSparkpointCt().setTitle(selectedStudentSparkpoint.get('sparkpoint'));

            scoreField.setValue(selectedStudentSparkpoint.get('learn_mastery_check_score'));
            scoreField.resetOriginalValue();

            learnCt.show();

            if (!store.isLoaded() && !store.isLoading()) { // TODO: OR extraParamsDirty
                proxy.setExtraParam('student_id', selectedStudentSparkpoint.get('student_id'));
                proxy.setExtraParam('sparkpoint', selectedStudentSparkpoint.get('sparkpoint'));

                store.load();
            }
        } else {
            learnCt.hide();
        }
    },

    setLearnsRequired: function() {
        var me = this,
            rawData = me.getWorkLearnsStore().getProxy().getReader().rawData;

        if (rawData && rawData.learns_required) {
            me.learnsRequiredSection = rawData.learns_required.section;
            me.learnsRequiredStudent = rawData.learns_required.student;
        }
    },

    refreshLearnProgress: function() { // eslint-disable-line complexity
        var me = this,
            progressBanner = me.getProgressBanner(),
            learnsStore = me.getWorkLearnsStore(),
            learns = learnsStore.getRange(),
            rawData = learnsStore.getProxy().getReader().rawData,
            count = learns.length,
            completed = 0,
            minimumRequired = Math.min(count, 5),
            requiredLearns = 0,
            completedRequiredLearns = 0,
            i = 0,
            learn, learnAssignments;

        if (rawData && rawData.learns_required && rawData.learns_required.site) {
            minimumRequired = Math.min(count, rawData.learns_required.site);
        }

        if (me.learnsRequiredStudent !== null) {
            minimumRequired = Math.min(count, me.learnsRequiredStudent);
        } else if (me.learnsRequiredSection !== null) {
            minimumRequired = Math.min(count, me.learnsRequiredSection);
        }

        if (!progressBanner) {
            // learns tab hasn't been activated yet
            return;
        }

        for (; i < count; i++) {
            learn = learns[i];
            learnAssignments = learn.get('assignments');

            if (learn.get('completed')) {
                completed++;
            }

            if (
                learnAssignments.section == 'required-first'
                || learnAssignments.student == 'required-first'
                || learnAssignments.section == 'required'
                || learnAssignments.student == 'required'
            ) {
                if (learn.get('completed')) {
                    completedRequiredLearns++;
                }
                requiredLearns++;
            }
        }

        progressBanner.setData({
            completedLearns: completed,
            minimumLearns: minimumRequired,
            completedRequiredLearns: completedRequiredLearns,
            requiredLearns: requiredLearns,
            name: me.getAppCt().getSelectedStudentSparkpoint().get('student_name')
        });

        progressBanner.show();
    },

    writeMasteryCheckScore: function() {
        var me = this,
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            scoreField = me.getMasteryCheckScoreField(),
            score = scoreField && scoreField.getValue();

        if (!scoreField || !selectedStudentSparkpoint) {
            return;
        }

        if (score !== null && (score < 0 || score > 100)) {
            Ext.Msg.alert('Mastery Check Score', 'Enter a number between 0 and 100 for mastery check score');
            return;
        }

        selectedStudentSparkpoint.set('learn_mastery_check_score', score);

        if (selectedStudentSparkpoint.dirty) {
            selectedStudentSparkpoint.save();
        }
    }
});