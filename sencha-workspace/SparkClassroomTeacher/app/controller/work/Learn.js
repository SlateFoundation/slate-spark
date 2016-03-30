/* global Slate */
/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Learn', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.DelayedTask'
    ],


    config: {
        selectedSection: null
    },

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
        controller: {
            '#': {
                sectionselect: 'onSectionSelect'
            }
        },
        store: {
            '#gps.ActiveStudents': {
                update: 'onActiveStudentUpdate'
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

    onSectionSelect: function(section) {
        this.setSelectedSection(section);
    },

    onActiveStudentUpdate: function(activeStudentsStore, studentSparkpoint, operation, modifiedFieldNames) {
        var me = this,
            scoreField;

        if (
            operation == 'edit' &&
            studentSparkpoint === me.getAppCt().getSelectedStudentSparkpoint() &&
            modifiedFieldNames.indexOf('learn_mastery_check_score') != -1
        ) {
            scoreField = me.getMasteryCheckScoreField();

            if (scoreField) {
                scoreField.setValue(studentSparkpoint.get('learn_mastery_check_score'));
                scoreField.resetOriginalValue();
            }
        }
    },

    onLearnsStoreLoad: function() {
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
            student_id: selectedStudentSparkpoint.get('student_id'),
            sparkpoint: selectedStudentSparkpoint.get('sparkpoint'),
            phase: 'learn',
            message: message
        });

        feedbackMessageField.reset();
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            itemData = data.item,
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
                },{
                    dirty: false
                });
            }
        } else if (table == 'learn_assignments_section') {
            if (
                (selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint())
                && itemData.sparkpoint_code == selectedStudentSparkpoint.get('sparkpoint')
                && itemData.section_code == me.getSelectedSection()
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({section: itemData.assignment || null}, learn.get('assignments')));

                // TODO: remove this #hack when underlying #framework-bug gets fixed
                me.getLearnGrid().refresh();
            }
        } else if (table == 'learn_assignments_student') {
            if (
                (selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint())
                && itemData.student_id == selectedStudentSparkpoint.get('student_id')
                && itemData.sparkpoint_code == selectedStudentSparkpoint.get('sparkpoint')
                && itemData.section_code == me.getSelectedSection()
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({student: itemData.assignment || null}, learn.get('assignments')));

                // TODO: remove this #hack when underlying #framework-bug gets fixed
                me.getLearnGrid().refresh();
            }
        }
    },


    // controller methods
    syncSelectedStudentSparkpoint: function() {
        var me = this,
            learnCt = me.getLearnCt(),
            scoreField = me.getMasteryCheckScoreField(),
            store = me.getWorkLearnsStore(),
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
                store.load();
            }
        } else {
            learnCt.hide();
        }
    },

    refreshLearnProgress: function() {
        var me = this,
            progressBanner = me.getProgressBanner(),
            learns = me.getWorkLearnsStore().getRange(),
            count = learns.length,
            completed = 0,
            required = Math.min(count, 5),
            i = 0;

        if (!progressBanner) {
            // learns tab hasn't been activated yet
            return;
        }

        for (; i < count; i++) {
            if (learns[i].get('completed')) {
                completed++;
            }
        }

        progressBanner.setData({
            completedLearns: completed,
            name: me.getAppCt().getSelectedStudentSparkpoint().get('student_name'),
            requiredLearns: required
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