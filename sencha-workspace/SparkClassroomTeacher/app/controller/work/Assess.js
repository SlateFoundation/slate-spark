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
        reflectionCt: 'spark-teacher-work-assess #reflectionCt',
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
                activestudentselect: 'onActiveStudentSelect'
            }
        },
        store: {
            '#gps.ActiveStudents': {
                update: 'onActiveStudentUpdate'
            },
            '#work.Assessments': {
                load: 'onAssessmentsStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // config handlers
    updateActiveStudent: function(activeStudent) {
        var store = this.getWorkAssessmentsStore(),
            proxy = store.getProxy();

        if (activeStudent) {
            // TODO: track dirty state of extraparams?
            proxy.setExtraParam('student_id', activeStudent.get('student_id'));
            proxy.setExtraParam('sparkpoint', activeStudent.get('sparkpoint'));

            // TODO: reload store if sparkpoints param dirty
            if (store.isLoaded()) {
                store.load();
            }
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

    onActiveStudentUpdate: function(activeStudentsStore, activeStudent, operation, modifiedFieldNames) {
        if (
            operation == 'edit' &&
            activeStudent === this.getActiveStudent() &&
            (
                modifiedFieldNames.indexOf('assess_ready_time') != -1 ||
                modifiedFieldNames.indexOf('assess_finish_time') != -1
            )
        ) {
            this.refreshCompleteBtn();
        }
    },

    onAssessmentsStoreLoad: function(assessStore) {
        this.getReflectionCt().setData(assessStore.getProxy().getReader().rawData);
    },

    onCompleteBtnTap: function() {
        var student = this.getActiveStudent();

        if (!student.get('assess_finish_time')) {
            student.set('assess_finish_time', new Date());
            student.save();
            this.refreshCompleteBtn();
        }
    },

    onSocketData: function(socket, data) {
        if (data.table != 'assesses') {
            return;
        }

        var student = this.getActiveStudent(),
            itemData = data.item,
            reflectionCt;

        if (
            student &&
            itemData.student_id == student.getId() &&
            itemData.sparkpoint_id == student.get('sparkpoint_id') &&
            (reflectionCt = this.getReflectionCt())
        ) {
            reflectionCt.setData(itemData);
        }
    },


    // controller methods
    syncActiveStudent: function() {
        var me = this,
            student = me.getActiveStudent(),
            assessCt = me.getAssessCt(),
            assessmentsStore = me.getWorkAssessmentsStore(),
            learnsStore = Ext.getStore('work.Learns'),
            appliesStore = Ext.getStore('work.Applies');

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

            // if (!appliesStore.isLoaded() && !appliesStore.isLoading()) { // TODO: OR extraParamsDirty
            //     appliesStore.load();
            // }

            me.refreshCompleteBtn();
        } else {
            assessCt.hide();
        }
    },

    refreshCompleteBtn: function() {
        var completeBtn = this.getCompleteBtn(),
            student = this.getActiveStudent(),
            assessFinishTime = student && student.get('assess_finish_time');

        if (!completeBtn || !student) {
            return;
        }

        completeBtn.setDisabled(assessFinishTime || !student.get('assess_ready_time'));
        completeBtn.setText(assessFinishTime ? 'Standard Completed' : completeBtn.config.text);
    }
});