/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Assess', {
    extend: 'Ext.app.Controller',


    config: {
        activeStudent: null,
        activeSparkpoint: null
    },


    stores: [
        'work.Assessments@SparkClassroom.store'
    ],

    refs: {
        assessCt: 'spark-teacher-work-assess'
    },

    control: {
        assessCt: {
            activate: 'onAssessCtActivate'
        }
    },

    listen: {
        controller: {
            '#': {
                activestudentselect: 'onActiveStudentSelect'
            }
        }
    },


    // config handlers
    updateActiveStudent: function(activeStudent) {
        this.setActiveSparkpoint(activeStudent.get('sparkpoint'));
    },

    updateActiveSparkpoint: function(sparkpoint) {
        var store = this.getWorkAssessmentsStore();

        // TODO: track dirty state of extraparams?
        store.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // TODO: reload store if sparkpoints param dirty
        if (store.isLoaded()) {
            store.load();
        }

        this.syncActiveSparkpoint();
    },


    // event handlers
    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onSparkpointSelect: function(sparkpoint) {
        this.setActiveSparkpoint(sparkpoint);
    },

    onAssessCtActivate: function() {
        this.syncActiveSparkpoint();
    },


    // controller methods
    syncActiveSparkpoint: function() {
        var me = this,
            assessCt = me.getAssessCt(),
            assessmentsStore = me.getWorkAssessmentsStore(),
            learnsStore = Ext.getStore('work.Learns'),
            appliesStore = Ext.getStore('work.Applies'),
            sparkpoint = me.getActiveSparkpoint();

        if (!assessCt) {
            return;
        }

        if (sparkpoint) {
            assessCt.show();

            if (!assessmentsStore.isLoaded()) { // TODO: OR extraParamsDirty
                assessmentsStore.load();
            }

            if (!learnsStore.isLoaded()) { // TODO: OR extraParamsDirty
                learnsStore.load();
            }

            if (!appliesStore.isLoaded()) { // TODO: OR extraParamsDirty
                appliesStore.load();
            }
        } else {
            assessCt.hide();
        }
    }
});