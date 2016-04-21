Ext.define('SparkClassroomTeacher.controller.work.Assess', {
    extend: 'Ext.app.Controller',


    stores: [
        'work.Assessments@SparkClassroom.store'
    ],

    models: [
        'StudentSparkpoint@SparkClassroom.model'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
        assessCt: 'spark-teacher-work-assess',
        reflectionCt: 'spark-teacher-work-assess #reflectionCt',
        sparkpointField: 'spark-teacher-work-assess  spark-sparkpointfield',
        completeBtn: 'spark-teacher-work-assess #completeBtn'
    },

    control: {
        appCt: {
            selectedstudentsparkpointchange: 'onSelectedStudentSparkpointChange'
        },
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


    // event handlers
    onSelectedStudentSparkpointChange: function(appCt, selectedStudentSparkpoint) {
        var me = this,
            sparkpointField = me.getSparkpointField(),
            store = me.getWorkAssessmentsStore(),
            proxy = store.getProxy();

        if (selectedStudentSparkpoint) {
            // TODO: track dirty state of extraparams?
            proxy.setExtraParam('student_id', selectedStudentSparkpoint.get('student_id'));
            proxy.setExtraParam('sparkpoint', selectedStudentSparkpoint.get('sparkpoint'));

            // TODO: reload store if sparkpoints param dirty
            if (store.isLoaded()) {
                store.load();
            }
        }

        if (sparkpointField) {
            sparkpointField.getSuggestionsList().hide();
        }

        me.syncSelectedStudentSparkpoint();
    },

    onAssessCtActivate: function() {
        this.syncSelectedStudentSparkpoint();
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
            activeStudent === this.getAppCt().getSelectedStudentSparkpoint() &&
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
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            sparkpointField = me.getSparkpointField(),
            recommendedSparkpoint = sparkpointField.getSelectedSparkpoint(),
            completeBtnDirty = false,
            studentSparkpoint;

        if (!selectedStudentSparkpoint.get('assess_finish_time')) {
            selectedStudentSparkpoint.set('assess_finish_time', new Date());
            selectedStudentSparkpoint.save();

            completeBtnDirty = true;
        }

        if (recommendedSparkpoint) {
            me.getCompleteBtn().disable();

            studentSparkpoint = me.getStudentSparkpointModel().create({
                sparkpoint: recommendedSparkpoint.getId()
            });

            studentSparkpoint.set('student_id', student.get('student_id'));

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

        var selectedStudentSparkpoint = this.getAppCt().getSelectedStudentSparkpoint(),
            itemData = data.item,
            reflectionCt;

        if (
            selectedStudentSparkpoint &&
            itemData.student_id == selectedStudentSparkpoint.get('student_id') &&
            itemData.sparkpoint_id == selectedStudentSparkpoint.get('sparkpoint_id') &&
            (reflectionCt = this.getReflectionCt())
        ) {
            reflectionCt.setData(itemData);
        }
    },


    // controller methods
    syncSelectedStudentSparkpoint: function() {
        var me = this,
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            assessCt = me.getAssessCt(),
            assessmentsStore = me.getWorkAssessmentsStore(),
            learnsStore = Ext.getStore('work.Learns'),
            // appliesStore = Ext.getStore('work.Applies'),
            sparkpointField = me.getSparkpointField(),
            sparkpointSuggestionsStore = sparkpointField && sparkpointField.getSuggestionsList().getStore();

        if (!assessCt) {
            return;
        }

        if (selectedStudentSparkpoint) {
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

            sparkpointSuggestionsStore.getProxy().setExtraParam('student_id', selectedStudentSparkpoint.get('student_id'));

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
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            assessFinishTime = selectedStudentSparkpoint && selectedStudentSparkpoint.get('assess_finish_time')

        if (!completeBtn || !selectedStudentSparkpoint) {
            return;
        }

        sparkpointField.setDisabled(!selectedStudentSparkpoint.get('assess_ready_time'));

        completeBtn.setDisabled((assessFinishTime && !selectedSparkpoint) || !selectedStudentSparkpoint.get('assess_ready_time'));
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