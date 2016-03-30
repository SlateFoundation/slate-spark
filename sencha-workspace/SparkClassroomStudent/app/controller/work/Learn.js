/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
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
        sparkpointCt: 'spark-student-work-learn #sparkpointCt',
        progressBanner: 'spark-work-learn-progressbanner',
        learnGrid: 'spark-work-learn-grid',
        readyBtn: 'spark-student-work-learn #readyForConferenceBtn'
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


    // config handlers
    updateStudentSparkpoint: function(studentSparkpoint) {
        var me = this,
            store = me.getWorkLearnsStore(),
            sparkpointCt = me.getSparkpointCt(),
            sparkpointCode = studentSparkpoint && studentSparkpoint.get('sparkpoint');

        store.removeAll();

        if (!studentSparkpoint) {
            return;
        }

        store.getProxy().setExtraParam('sparkpoint', sparkpointCode);
        store.load();

        if (sparkpointCt) {
            sparkpointCt.setTitle(sparkpointCode);
        }
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

        me.getSparkpointCt().setTitle(studentSparkpoint ? studentSparkpoint.get('sparkpoint') : 'Loading&hellip;');
        me.refreshLearnProgress();
    },

    onLearnsStoreLoad: function() {
        this.refreshLearnProgress();
        this.ensureLearnPhaseStarted();
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
        }
    },

    onReadyBtnTap: function() {
        var me = this,
            studentSparkpoint = me.getStudentSparkpoint();

        if (!studentSparkpoint.get('learn_finish_time')) {
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
            studentSparkpoint = me.getStudentSparkpoint(),
            learnFinishTime = studentSparkpoint && studentSparkpoint.get('learn_finish_time'),
            learns = me.getWorkLearnsStore().getRange(),
            count = learns.length,
            completed = 0,
            required = Math.min(count, 5),
            i = 0;

        if (!progressBanner || !readyBtn) {
            // learns tab hasn't been activated yet
            return;
        }

        if (count) {
            for (; i < count; i++) {
                if (learns[i].get('completed')) {
                    completed++;
                }
            }

            progressBanner.setData({
                completedLearns: completed,
                name: null,
                requiredLearns: required
            });

            progressBanner.show();
        } else {
            progressBanner.hide();
        }

        readyBtn.setDisabled(learnFinishTime || completed < required);
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