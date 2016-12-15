Ext.define('SparkClassroomTeacher.controller.work.Assess', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.MessageBox',

        /* global Slate */
        'Slate.API'
    ],


    stores: [
        'work.Assessments@SparkClassroom.store'
    ],

    models: [
        'StudentSparkpoint@SparkClassroom.model'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
        workCt: 'spark-teacher-work-ct',
        assessCt: 'spark-teacher-work-assess',
        reflectionCt: 'spark-teacher-work-assess #reflectionCt',
        sparkpointField: 'spark-teacher-work-assess  spark-sparkpointfield',
        suggestBtn: 'spark-teacher-work-assess #suggestBtn',
        completeBtn: 'spark-teacher-work-assess #completeBtn',
        sparkpointSelectList: 'spark-teacher-work-assess-footer #sparkpointSelectList'
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
        suggestBtn: {
            tap: 'onSuggestBtnTap'
        },
        completeBtn: {
            tap: 'onCompleteBtnTap'
        }
    },

    listen: {
        store: {
            '#StudentSparkpoints': {
                update: 'onStudentSparkpointsStoreUpdate'
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
            sparkpointField.setSelectedSparkpoint(null);
            sparkpointField.setQuery(null);
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

    onStudentSparkpointsStoreUpdate: function(studentSparkpointsStore, activeStudent, operation, modifiedFieldNames) {
        if (
            operation == 'edit'
            && activeStudent === this.getAppCt().getSelectedStudentSparkpoint()
            && (
                modifiedFieldNames.indexOf('assess_ready_time') != -1
                || modifiedFieldNames.indexOf('assess_completed_time') != -1
            )
        ) {
            this.refreshCompleteBtn();
        }
    },

    onAssessmentsStoreLoad: function(assessStore) {
        this.getReflectionCt().setData(assessStore.getProxy().getReader().rawData);
    },

    onSparkpointFieldChange: function() {
        this.refreshSuggestBtn();
    },

    onSuggestBtnTap: function() {
        var me = this,
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            sparkpointField = me.getSparkpointField(),
            recommendedSparkpoint = sparkpointField.getSelectedSparkpoint();

        if (!recommendedSparkpoint) {
            return;
        }

        Slate.API.request({
            method: 'PATCH',
            url: '/spark/api/work/activity',
            jsonData: {
                'sparkpoint': recommendedSparkpoint.getId(),
                'student_id': selectedStudentSparkpoint.get('student_id')
            },
            callback: function(options, success) {
                if (!success) {
                    Ext.Msg.alert('Failed to recommend sparkpoint', 'This sparkpoint could not be added to the student\'s recommended sparkpoints, please try again or contact an administrator');
                    return;
                }

                sparkpointField.setSelectedSparkpoint(null);
                sparkpointField.setQuery(null);
            }
        });
    },

    onCompleteBtnTap: function() {
        var me = this,
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            completeBtnDirty = false,
            list = me.getSparkpointSelectList(),
            selection = list && list.getSelections();

        if (selectedStudentSparkpoint && selectedStudentSparkpoint.get('is_lesson')) {
            if (!selection || selection.length === 0) {
                Ext.Msg.alert('No Selection', 'Please select at least one sparkpoint to mark complete for this lesson.');
                return;
            }

            // TODO loop through selections, set assess_finish??? (should this be override time?) time if no completed time and save
            return;
        }

        if (!selectedStudentSparkpoint.get('assess_completed_time')) {
            selectedStudentSparkpoint.set('assess_finish_time', new Date());
            selectedStudentSparkpoint.save();

            completeBtnDirty = true;
        }

        if (completeBtnDirty) {
            me.refreshCompleteBtn();
        }
    },

    onSocketData: function(socket, data) {
        if (data.table != 'assesses') {
            return;
        }

        var selectedStudentSparkpoint = this.getAppCt().getSelectedStudentSparkpoint(), // eslint-disable-line vars-on-top
            itemData = data.item,
            reflectionCt;

        if (
            data.table == 'assessses'
            && selectedStudentSparkpoint
            && itemData.student_id == selectedStudentSparkpoint.get('student_id')
            && itemData.sparkpoint_id == selectedStudentSparkpoint.get('sparkpoint_id')
            && (reflectionCt = this.getReflectionCt())
        ) {
            reflectionCt.setData(itemData);
        }
    },


    // controller methods
    syncSelectedStudentSparkpoint: function() {
        var me = this,
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            assessCt = me.getAssessCt(),
            workCt = me.getWorkCt(),
            list = me.getSparkpointSelectList(),
            assessmentsStore = me.getWorkAssessmentsStore(),
            learnsStore = Ext.getStore('work.Learns'),
            sparkpointField = me.getSparkpointField(),
            sparkpointSuggestionsStore = sparkpointField && sparkpointField.getSuggestionsList().getStore(),
            completeBtn = me.getCompleteBtn(),
            lesson;

        if (!assessCt) {
            return;
        }

        if (selectedStudentSparkpoint) {
            assessCt.show();

            assessmentsStore.load();
            learnsStore.load();

            sparkpointSuggestionsStore.getProxy().setExtraParam('student_id', selectedStudentSparkpoint.get('student_id'));
            sparkpointSuggestionsStore.load();

            me.refreshSuggestBtn();
            me.refreshCompleteBtn();

            if (selectedStudentSparkpoint.get('is_lesson')) {
                lesson = workCt && workCt.getLesson();

                list.show();
                list.getStore().loadData(lesson && lesson.get('sparkpoints'));

                completeBtn.setText('Mark Selected Complete');

                completeBtn.enable(); // TODO remove
            } else {
                completeBtn.setText('Mark Standard Complete');
                list.hide();
            }
        } else {
            assessCt.hide();
        }
    },

    refreshSuggestBtn: function() {
        var me = this,
            suggestBtn = me.getSuggestBtn(),
            selectedSparkpoint = me.getSparkpointField().getSelectedSparkpoint();

        suggestBtn.setDisabled(!selectedSparkpoint);
    },

    refreshCompleteBtn: function() {
        var me = this,
            completeBtn = me.getCompleteBtn(),
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            assessCompleteTime = selectedStudentSparkpoint && selectedStudentSparkpoint.get('assess_completed_time');

        if (!completeBtn || !selectedStudentSparkpoint) {
            return;
        }

        completeBtn.setDisabled(assessCompleteTime || !selectedStudentSparkpoint.get('assess_ready_time'));
        completeBtn.setText(completeBtn.config.text);
    }
});