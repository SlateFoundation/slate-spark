/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Assess', {
    extend: 'Ext.app.Controller',


    config: {
        activeSparkpoint: null
    },


    stores: [
        'work.Assessments@SparkClassroom.store'
    ],

    refs: {
        assessCt: 'spark-student-work-assess'
    },

    control: {
        assessCt: {
            activate: 'onAssessCtActivate'
        }
    },

    listen: {
        controller: {
            '#': {
                sparkpointselect: 'onSparkpointSelect'
            }
        }
    },


    // config handlers
    updateActiveSparkpoint: function(sparkpoint) {
        var store = this.getWorkAssessmentsStore();

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

    onAssessCtActivate: function(learnCt) {
        var assessmentsStore = this.getWorkAssessmentsStore(),
            learnsStore = Ext.getStore('work.Learns'),
            appliesStore = Ext.getStore('work.Applies');

        if (!assessmentsStore.isLoaded()) { // TODO: OR extraParamsDirty
            assessmentsStore.load();
        }

        if (!learnsStore.isLoaded()) { // TODO: OR extraParamsDirty
            learnsStore.load();
        }

        if (!appliesStore.isLoaded()) { // TODO: OR extraParamsDirty
            appliesStore.load();
        }
    }
});