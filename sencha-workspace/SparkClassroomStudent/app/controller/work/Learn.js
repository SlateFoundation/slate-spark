/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Learn', {
    extend: 'Ext.app.Controller',


    config: {
        activeSparkpoint: null,
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
                sparkpointselect: 'onSparkpointSelect',
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
    updateActiveSparkpoint: function(sparkpoint) {
        var store = this.getWorkLearnsStore();

        // TODO: track dirty state of extraparams?
        store.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // TODO: reload store if sparkpoints param dirty
        if (store.isLoaded()) {
            store.load();
        }
    },


    // event handlers
    onSparkpointSelect: function(sparkpoint) {
        this.setActiveSparkpoint(sparkpoint);
    },

    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onLearnCtActivate: function(learnCt) {
        var me = this,
            store = me.getWorkLearnsStore(),
            activeSparkpoint = me.getActiveSparkpoint();

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        me.getSparkpointCt().setTitle(activeSparkpoint);

        if (activeSparkpoint && !store.isLoaded()) { // TODO: OR extraParamsDirty
            store.load();
        } else {
            me.refreshLearnProgress();
        }
    },

    onLearnsStoreLoad: function() {
        this.refreshLearnProgress();
    },

    onLearnsStoreUpdate: function() {
        this.refreshLearnProgress();
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

            // mark learn phase as started if a learn has been launched
            if (updatedLearn.get('launched') && !studentSparkpoint.get('learn_start_time')) {
                studentSparkpoint.set('learn_start_time', new Date());
                studentSparkpoint.save();
            }
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
    }
});