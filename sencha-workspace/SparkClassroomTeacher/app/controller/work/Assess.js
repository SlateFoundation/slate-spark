/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Assess', {
    extend: 'Ext.app.Controller',


    config: {
        activeStudent: null
    },


    stores: [
        'work.Assessments@SparkClassroom.store'
    ],

    refs: {
        assessCt: 'spark-teacher-work-assess',
        completeBtn: 'spark-teacher-work-assess #completeBtn'
    },

    control: {
        assessCt: {
            activate: 'onAssessCtActivate'
        },
        completeBtn: {
            tap: 'onCompleteBtnTap'
        }
    },

    listen: {
        controller: {
            '#': {
                activestudentselect: 'onActiveStudentSelect',
                studentupdate: 'onStudentUpdate'
            }
        }
    },


    // config handlers
    updateActiveStudent: function(student) {
        var store = this.getWorkAssessmentsStore(),
            proxy = store.getProxy();

        // TODO: track dirty state of extraparams?
        proxy.setExtraParam('student_id', student.get('student_id'));
        proxy.setExtraParam('sparkpoint', student.get('sparkpoint'));

        // TODO: reload store if sparkpoints param dirty
        if (store.isLoaded()) {
            store.load();
        }

        this.syncActiveStudent();
    },


    // event handlers
    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onAssessCtActivate: function() {
        this.syncActiveStudent();
    },

    onStudentUpdate: function(student) {
        if (student === this.getActiveStudent()) {
            this.syncActiveStudent();
        }
    },

    onCompleteBtnTap: function() {
        var student = this.getActiveStudent();

        student.set('assess_finish_time', new Date());
        student.save();
    },


    // controller methods
    syncActiveStudent: function() {
        var me = this,
            student = me.getActiveStudent(),
            assessCt = me.getAssessCt(),
            assessmentsStore = me.getWorkAssessmentsStore(),
            learnsStore = Ext.getStore('work.Learns'),
            appliesStore = Ext.getStore('work.Applies');;

        if (!assessCt) {
            return;
        }

        if (student) {
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

            me.getCompleteBtn().setDisabled(!student.get('assess_start_time'));
        } else {
            assessCt.hide();
        }
    }
});