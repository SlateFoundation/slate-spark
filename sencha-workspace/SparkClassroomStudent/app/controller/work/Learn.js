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
                studentsparkpointload: 'onStudentSparkpointLoad'
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
            learnCt = me.getLearnCt(),
            sparkpointCt = me.getSparkpointCt(),
            sparkpointCode = studentSparkpoint.get('sparkpoint');

        store.getProxy().setExtraParam('sparkpoint', sparkpointCode);

        if (store.isLoaded() || (learnCt && learnCt.isPainted())) {
            store.removeAll();
            store.load();
        }

        if (sparkpointCt) {
            sparkpointCt.setTitle(sparkpointCode);
        }
    },


    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onLearnCtActivate: function(learnCt) {
        var me = this,
            store = me.getWorkLearnsStore(),
            studentSparkpoint = me.getStudentSparkpoint();

        me.getSparkpointCt().setTitle(studentSparkpoint ? studentSparkpoint.get('sparkpoint') : 'Loading&hellip;');

        if (studentSparkpoint && !store.isLoaded()) {
            store.load();
        } else {
            me.refreshLearnProgress();
        }
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
        if (data.table != 'learn_activity') {
            return;
        }

        var me = this,
            studentSparkpoint = me.getStudentSparkpoint(),
            itemData = data.item,
            updatedLearn;

        if (!studentSparkpoint || studentSparkpoint.get('student_id') != itemData.user_id) {
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

            me.ensureLearnPhaseStarted();
        }
    },

    onReadyBtnTap: function() {
        var studentSparkpoint = this.getStudentSparkpoint();

        if (!studentSparkpoint.get('learn_finish_time')) {
            studentSparkpoint.set('learn_finish_time', new Date());
            studentSparkpoint.save();
        }

        this.redirectTo('work/conference')
    },


    // controller methods
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

        if (!count) {
            progressBanner.hide();
            return;
        }

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

        me.getReadyBtn().setDisabled(completed < required);
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