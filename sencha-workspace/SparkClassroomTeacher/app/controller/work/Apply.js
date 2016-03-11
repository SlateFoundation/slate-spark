/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Apply', {
    extend: 'Ext.app.Controller',


    config: {
        activeApply: null
    },

    stores: [
        'work.Applies@SparkClassroom.store',
        'work.ApplyTasks@SparkClassroom.store'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
        applyCt: 'spark-teacher-work-apply',
        applyPickerCt: 'spark-teacher-work-apply #applyPickerCt',
        selectedApplyCt: 'spark-teacher-work-apply #selectedApplyCt',
        headerCmp: 'spark-teacher-work-apply #headerCmp',
        timelineCmp: 'spark-teacher-work-apply #timelineCmp',
        linksCmp: 'spark-teacher-work-apply #linksCmp',
        tasksGrid: 'spark-teacher-work-apply spark-work-apply-tasksgrid',
        reflectionCt: 'spark-teacher-work-apply #reflectionCt',
        submissionsView: 'spark-teacher-work-apply #submissionsView',
        feedbackMessageField: 'spark-teacher-work-apply spark-teacher-feedbackform textareafield',
        gradePanel: 'spark-teacher-work-apply-gradepanel',
        readyBtn: 'spark-teacher-work-apply #readyForAssessBtn',
        readyHintCmp: 'spark-teacher-work-apply #readyHintCmp'
    },

    control: {
        appCt: {
            selectedstudentsparkpointchange: 'onSelectedStudentSparkpointChange'
        },
        applyCt: {
            activate: 'onApplyCtActivate'
        },
        'spark-teacher-work-apply spark-teacher-feedbackform button#sendBtn': {
            tap: 'onFeedbackSendTap'
        },
        gradePanel: {
            gradechange: 'onGradePanelGradeChange'
        },
        readyBtn: {
            tap: 'onReadyBtnTap'
        }
    },

    listen: {
        store: {
            '#gps.ActiveStudents': {
                update: 'onActiveStudentUpdate'
            },
            '#work.Applies': {
                load: 'onAppliesStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // config handlers
    updateActiveApply: function(apply) {
        this.syncActiveApply();
    },


    // event handlers
    onSelectedStudentSparkpointChange: function(appCt, selectedStudentSparkpoint) {
        var me = this,
            store = me.getWorkAppliesStore(),
            proxy = store.getProxy();

        if (selectedStudentSparkpoint) {
            // TODO: track dirty state of extraparams?
            proxy.setExtraParam('student_id', selectedStudentSparkpoint.get('student_id'));
            proxy.setExtraParam('sparkpoint', selectedStudentSparkpoint.get('sparkpoint'));
            store.load();
        }

        me.setActiveApply(null);

        me.syncReadyState();
    },

    onActiveStudentUpdate: function(activeStudentsStore, activeStudent, operation, modifiedFieldNames) {
        if (
            operation == 'edit' &&
            activeStudent === this.getAppCt().getSelectedStudentSparkpoint()
        ) {
            this.syncReadyState();
        }
    },

    onApplyCtActivate: function() {
        this.syncActiveApply();
        this.syncReadyState();
    },

    onAppliesStoreLoad: function(appliesStore) {
        this.setActiveApply(appliesStore.query('selected', true).first() || null);
    },

    onFeedbackSendTap: function() {
        var selectedStudentSparkpoint = this.getAppCt().getSelectedStudentSparkpoint(),
            feedbackMessageField = this.getFeedbackMessageField(),
            message = (feedbackMessageField.getValue() || '').trim();

        if (!message) {
            Ext.Msg.alert('Feedback', 'Enter a message before sending feedback');
            return;
        }

        Ext.getStore('work.Feedback').add({
            student_id: selectedStudentSparkpoint.get('student_id'),
            sparkpoint: selectedStudentSparkpoint.get('sparkpoint'),
            phase: 'apply',
            message: message
        });

        feedbackMessageField.reset();
    },

    onGradePanelGradeChange: function(gradePanel, grade) {
        var apply = this.getActiveApply();
        apply.set('grade', grade);

        if (apply.dirty) {
            apply.save();
        }
    },

    onReadyBtnTap: function() {
        var selectedStudentSparkpoint = this.getAppCt().getSelectedStudentSparkpoint();

        if (!selectedStudentSparkpoint.get('apply_finish_time')) {
            selectedStudentSparkpoint.set('apply_finish_time', new Date());
            selectedStudentSparkpoint.save();
            this.syncReadyState();
        }
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            item = data.item,
            task, apply, activeApply,
            selectedStudentSparkpoint, appliesStore, modifiedFieldNames;

        if (table == 'todos') {
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint();

            if (
                selectedStudentSparkpoint &&
                item.user_id == selectedStudentSparkpoint.get('student_id') &&
                (task = me.getWorkApplyTasksStore().getById(item.id))
            ) {
                task.set(item, { dirty: false });
            }
        } else if (table == 'applies') {
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint();
            appliesStore = me.getWorkAppliesStore();

            if (
                selectedStudentSparkpoint &&
                item.student_id == selectedStudentSparkpoint.get('student_id') &&
                item.sparkpoint_id == selectedStudentSparkpoint.get('sparkpoint_id') &&
                (apply = appliesStore.getById(item.fb_apply_id))
            ) {
                modifiedFieldNames = apply.set({
                    reflection: item.reflection,
                    submissions: Ext.decode(item.submissions, true) || [],
                    grade: item.grade,
                    selected: item.selected
                }, { dirty: false });

                if (modifiedFieldNames.indexOf('selected') != -1) {
                    me.setActiveApply(appliesStore.query('selected', true).first() || null);
                } else if ((activeApply = me.getActiveApply()) && activeApply.getId() == apply.getId()) {
                    me.syncActiveApply();
                }
            }
        }
    },


    // controller methods
    syncActiveApply: function() {
        var me = this,
            applyCt = me.getApplyCt(),
            apply = me.getActiveApply(),
            applyData = apply && apply.getData(),
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            startTime = selectedStudentSparkpoint && selectedStudentSparkpoint.get('apply_start_time');

        if (!applyCt) {
            return;
        }

        if (apply) {
            me.getHeaderCmp().setData(applyData);

            me.getTimelineCmp().setData({
                start: startTime,
                finish: selectedStudentSparkpoint && selectedStudentSparkpoint.get('apply_finish_time'),
                estimate: startTime && Ext.Date.add(startTime, Ext.Date.DAY, 3)
            });

            me.getLinksCmp().setData(apply.get('links').map(function(link) {
                return {
                    title: link.title || link.url.replace(/^https?:\/\//, ''),
                    url: link.url
                };
            }));

            me.getWorkApplyTasksStore().loadData(apply.get('todos'));

            me.getReflectionCt().setData(applyData);

            me.getSubmissionsView().getStore().loadData(apply.get('submissions'));

            me.getReadyHintCmp().setData(selectedStudentSparkpoint.getData());

            me.getGradePanel().setGrade(apply.get('grade'));
        }

        me.getApplyPickerCt().setHidden(apply);
        me.getSelectedApplyCt().setHidden(!apply);
    },

    syncReadyState: function() {
        var me = this,
            gradePanel = me.getGradePanel(),
            readyBtn = me.getReadyBtn(),
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            applyReadyTime = selectedStudentSparkpoint && selectedStudentSparkpoint.get('apply_ready_time'),
            applyFinishTime = selectedStudentSparkpoint && selectedStudentSparkpoint.get('apply_finish_time');

        if (!gradePanel || !readyBtn || !selectedStudentSparkpoint) {
            return;
        }

        gradePanel.setHidden(!applyReadyTime);
        readyBtn.setText(applyFinishTime ? 'Moved to Assess' : readyBtn.config.text);
        readyBtn.setDisabled(!applyReadyTime || applyFinishTime);
    }
});
