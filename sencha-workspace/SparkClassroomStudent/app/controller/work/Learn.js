/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Learn', {
    extend: 'Ext.app.Controller',


    config: {
        activeSparkpoint: null
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
        }
    },

    listen: {
        controller: {
            '#': {
                sparkpointselect: 'onSparkpointSelect'
            }
        },
        store: {
            '#work.Learns': {
                load: 'onLearnsStoreLoad',
                update: 'onLearnsStoreUpdate'
            }
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

    onLearnCtActivate: function(learnCt) {
        var me = this,
            store = me.getWorkLearnsStore();

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        me.getSparkpointCt().setTitle(me.getActiveSparkpoint());

        if (!store.isLoaded()) { // TODO: OR extraParamsDirty
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