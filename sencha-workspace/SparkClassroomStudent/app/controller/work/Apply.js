/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Apply', {
    extend: 'Ext.app.Controller',

    config: {
        activeSparkpoint: null
    },

    stores: [
        'work.Applies@SparkClassroom.store'
    ],

    refs: {
        applyCt: 'spark-student-work-apply'
    },

    control: {
        applyCt: {
            activate: 'onApplyCtActivate'
        }
    },

    // config handlers
    updateActiveSparkpoint: function(sparkpoint) {
        var store = this.getWorkAppliesStore();

        // TODO: track dirty state of extraparams?
        store.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // TODO: reload store if sparkpoints param dirty
        if (store.isLoaded()) {
            store.load();
        }
    },

    // TODO: handle loading data into apply section
    onApplyCtActivate: function() {
        var store = this.getWorkAppliesStore();

        // TODO: reload store if sparkpoints param dirty
        if (!store.isLoaded()) {
            store.load();
        }
    }
});
