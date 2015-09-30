/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Learn', {
    extend: 'Ext.app.Controller',

    stores: [
        'work.Learns@SparkClassroom.store'
    ],

    refs: {
        learnCt: 'spark-student-work-learn',
        sparkpointCt: 'spark-student-work-learn #sparkpointCt',
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
        }
    },

    onSparkpointSelect: function(sparkpoint) {
        // TODO: track dirty state of extraparams?
        this.getWorkLearnsStore().getProxy().setExtraParam('sparkpoints', sparkpoint);
    },

    onLearnCtActivate: function(learnCt) {
        var me = this,
            store = me.getWorkLearnsStore();

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        me.getSparkpointCt().setTitle(store.getProxy().getExtraParams().sparkpoints);

        store.load();
        //TODO: Reenable when grid can start empty
        // if(!store.isLoaded()) {
        //     store.load();
        // }
    }
});