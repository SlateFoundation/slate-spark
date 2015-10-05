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
        learnGrid: 'spark-work-learn-grid'
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
                load: 'refreshProgressBar',
                update: 'refreshProgressBar'
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
        }
    },

    refreshProgressBar: function(store) {
        var recs = store.getRange(),
            count = recs.length,
            completed = 0,
            required = 0,
            i = 0,
            rec;

        for (i; i< count; i++) {
            rec = recs[i];

            // TODO: get actual value of required
            // if (rec.get('required')) {

            if (true) {
                required++;
                if (rec.get('completed')) {
                    completed++;
                }
            }
        }

        this.getProgressBanner().setData(
            {
                completedLearns: completed,
                name: null,
                requiredLearns: required
            }
        );
    }

});
