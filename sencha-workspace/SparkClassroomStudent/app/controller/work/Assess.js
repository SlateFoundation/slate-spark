/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Assess', {
    extend: 'Ext.app.Controller',


    config: {
        activeSparkpoint: null, // TODO: deprecate
        studentSparkpoint: null
    },


    stores: [
        'work.Assessments@SparkClassroom.store'
    ],

    refs: {
        assessCt: 'spark-student-work-assess',
        illuminateLauncher: 'spark-student-work-assess #illuminateLauncher'
    },

    control: {
        assessCt: {
            activate: 'onAssessCtActivate'
        },
        illuminateLauncher: {
            launchclick: 'onIlluminateLaunchClick'
        }
    },

    listen: {
        controller: {
            '#': {
                sparkpointselect: 'onSparkpointSelect',
                studentsparkpointload: 'onStudentSparkpointLoad'
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

    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
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
    },

    onIlluminateLaunchClick: function(launcher, ev) {
        var studentSparkpoint = this.getStudentSparkpoint();

        // TODO: disable/enable the button automatically
        if (!studentSparkpoint.get('apply_finish_time')) {
            Ext.Msg.alert('Not Ready', 'Wait until your apply has been graded before starting your assessment');
            ev.stopEvent();
            return;
        }

        studentSparkpoint.set('assess_start_time', new Date());
        studentSparkpoint.save();
    }
});