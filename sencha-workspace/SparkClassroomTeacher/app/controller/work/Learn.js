/* global Slate */
/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Learn', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.DelayedTask'
    ],


    config: {
        activeStudent: null
    },


    stores: [
        'work.Learns@SparkClassroom.store'
    ],

    refs: {
        learnCt: 'spark-teacher-work-learn',
        sparkpointCt: 'spark-teacher-work-learn #sparkpointCt',
        progressBanner: 'spark-teacher-work-learn-sidebar spark-work-learn-progressbanner',
        learnGrid: 'spark-work-learn-grid',
        masteryCheckScoreField: 'spark-teacher-work-learn #masteryCheckScoreField',
        feedbackMessageField: 'spark-teacher-work-learn spark-teacher-feedbackform textareafield'
    },

    control: {
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
                activestudentselect: 'onActiveStudentSelect'
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


    // config handlers
    updateActiveStudent: function(activeStudent, oldActiveStudent) {
        var me = this,
            store = me.getWorkLearnsStore(),
            proxy = store.getProxy();

        if (activeStudent) {
            // TODO: track dirty state of extraparams?
            proxy.setExtraParam('student_id', activeStudent.get('student_id'));
            proxy.setExtraParam('sparkpoint', activeStudent.get('sparkpoint'));

            if (store.isLoaded()) {
                store.load();
            }
        }

        me.syncActiveStudent();
    },


    // event handlers
    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onLearnCtActivate: function() {
        this.syncActiveStudent();
    },

    onActiveStudentUpdate: function(activeStudentsStore, activeStudent, operation, modifiedFieldNames) {
        var me = this,
            scoreField;

        if (
            operation == 'edit' &&
            activeStudent === me.getActiveStudent() &&
            modifiedFieldNames.indexOf('learn_mastery_check_score') != -1
        ) {
            scoreField = me.getMasteryCheckScoreField();

            if (scoreField) {
                scoreField.setValue(activeStudent.get('learn_mastery_check_score'));
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
        var activeStudent = this.getActiveStudent(),
            feedbackMessageField = this.getFeedbackMessageField(),
            message = (feedbackMessageField.getValue() || '').trim();

        if (!message) {
            Ext.Msg.alert('Feedback', 'Enter a message before sending feedback');
            return;
        }

        Ext.getStore('work.Feedback').add({
            student_id: activeStudent.getId(),
            sparkpoint: activeStudent.get('sparkpoint'),
            phase: 'learn',
            message: message
        });

        feedbackMessageField.reset();
    },

    onSocketData: function(socket, data) {
        if (data.table != 'learn_activity') {
            return;
        }

        var me = this,
            activeStudent = me.getActiveStudent(),
            itemData = data.item,
            updatedLearn;

        if (!activeStudent || activeStudent.getId() != itemData.user_id) {
            return;
        }

        updatedLearn = me.getWorkLearnsStore().getById(itemData.resource_id);

        if (updatedLearn) {
            // TODO: can we find ways to not duplicate this logic between the api and the client?
            // Can there be an abstraction on the server side so that a higher-level event comes down
            // with a delta to the object as returned by the API previously so we can just pass the whole
            // data object to set?
            updatedLearn.set({
                launched: itemData.start_status == 'launched',
                completed: itemData.completed
            },{
                dirty: false
            });
        }
    },


    // controller methods
    syncActiveStudent: function() {
        var me = this,
            learnCt = me.getLearnCt(),
            scoreField = me.getMasteryCheckScoreField(),
            store = me.getWorkLearnsStore(),
            student = me.getActiveStudent();

        if (!learnCt || !learnCt.hasParent()) {
            return;
        }

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        if (student) {
            me.getSparkpointCt().setTitle(student.get('sparkpoint'));

            scoreField.setValue(student.get('learn_mastery_check_score'));
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
            name: me.getActiveStudent().get('student_name'),
            requiredLearns: required
        });

        progressBanner.show();
    },

    writeMasteryCheckScore: function() {
        var me = this,
            activeStudent = me.getActiveStudent(),
            scoreField = me.getMasteryCheckScoreField(),
            score = scoreField && scoreField.getValue();

        if (!scoreField || !activeStudent) {
            return;
        }

        if (score !== null && (score < 0 || score > 100)) {
            Ext.Msg.alert('Mastery Check Score', 'Enter a number between 0 and 100 for mastery check score');
            return;
        }

        activeStudent.set('learn_mastery_check_score', score);

        if (activeStudent.dirty) {
            activeStudent.save();
        }
    }
});