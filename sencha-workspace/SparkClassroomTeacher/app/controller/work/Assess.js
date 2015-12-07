/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Assess', {
    extend: 'Ext.app.Controller',


    config: {
        activeStudent: null
    },


    stores: [
        'work.Assessments@SparkClassroom.store'
    ],

    models: [
        'StudentSparkpoint@SparkClassroom.model'
    ],

    refs: {
        assessCt: 'spark-teacher-work-assess',
        reflectionCt: 'spark-teacher-work-assess #reflectionCt',
        sparkpointField: 'spark-teacher-work-assess  spark-sparkpointfield',
        completeBtn: 'spark-teacher-work-assess #completeBtn'
    },

    control: {
        assessCt: {
            activate: 'onAssessCtActivate',
            deactivate: 'onAssessCtDeactivate'
        },
        sparkpointField: {
            sparkpointselect: 'onSparkpointFieldChange'
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
        var me = this,
            sparkpointField = me.getSparkpointField(),
            store = me.getWorkAssessmentsStore(),
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

        if (sparkpointField) {
            sparkpointField.getSuggestionsList().hide();
        }

        me.syncActiveStudent();
    },


    // event handlers
    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onAssessCtActivate: function() {
        this.syncActiveStudent();
    },

    onAssessCtDeactivate: function() {
        var sparkpointField = this.getSparkpointField();

        if (sparkpointField) {
            sparkpointField.getSuggestionsList().hide();
        }
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

    onSparkpointFieldChange: function(sparkpointField, sparkpoint) {
        this.refreshCompleteBtn();
    },

    onCompleteBtnTap: function() {
        var me = this,
            student = me.getActiveStudent(),
            sparkpointField = me.getSparkpointField(),
            recommendedSparkpoint = sparkpointField.getSelectedSparkpoint(),
            completeBtnDirty = false,
            studentSparkpoint;

        if (!student.get('assess_finish_time')) {
            student.set('assess_finish_time', new Date());
            student.save();

            completeBtnDirty = true;
        }

        if (recommendedSparkpoint) {
            me.getCompleteBtn().disable();

            studentSparkpoint = me.getStudentSparkpointModel().create({
                sparkpoint: recommendedSparkpoint.getId()
            });

            studentSparkpoint.set('student_id', student.getId());

            studentSparkpoint.save({
                callback: function(studentSparkpoint, operation, success) {
                    sparkpointField.setSelectedSparkpoint(null);
                    sparkpointField.setQuery(null);
                }
            });
        } else if (completeBtnDirty) {
            me.refreshCompleteBtn();
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
            // appliesStore = Ext.getStore('work.Applies'),
            sparkpointField = me.getSparkpointField(),
            sparkpointSuggestionsStore = sparkpointField && sparkpointField.getSuggestionsList().getStore();

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

            sparkpointSuggestionsStore.getProxy().setExtraParam('student_id', student.getId());

            if (sparkpointSuggestionsStore.isLoaded()) {
                sparkpointSuggestionsStore.load();
            }

            me.refreshCompleteBtn();
        } else {
            assessCt.hide();
        }
    },

    refreshCompleteBtn: function() {
        var me = this,
            completeBtn = me.getCompleteBtn(),
            sparkpointField = me.getSparkpointField(),
            selectedSparkpoint = sparkpointField.getSelectedSparkpoint(),
            student = me.getActiveStudent(),
            assessFinishTime = student && student.get('assess_finish_time')

        if (!completeBtn || !student) {
            return;
        }

        sparkpointField.setDisabled(!student.get('assess_ready_time'));

        completeBtn.setDisabled((assessFinishTime && !selectedSparkpoint) || !student.get('assess_ready_time'));
        completeBtn.setText(
            assessFinishTime ?
            (
                selectedSparkpoint ?
                'Suggest Next Sparkpoint' :
                'Sparkpoint Completed'
            ) :
            completeBtn.config.text
        );
    }
});