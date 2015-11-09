/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Apply', {
    extend: 'Ext.app.Controller',


    config: {
        activeStudent: null,
        activeApply: null
    },

    stores: [
        'work.Applies@SparkClassroom.store',
        'work.ApplyTasks@SparkClassroom.store'
    ],

    refs: {
        applyCt: 'spark-teacher-work-apply',
        headerCmp: 'spark-teacher-work-apply #headerCmp',
        timelineCmp: 'spark-teacher-work-apply #timelineCmp',
        linksCmp: 'spark-teacher-work-apply #linksCmp',
        tasksGrid: 'spark-teacher-work-apply spark-work-apply-tasksgrid',
        reflectionCmp: 'spark-teacher-work-apply #reflectionCmp',
        submissionsView: 'spark-teacher-work-apply #submissionsView',
        feedbackMessageField: 'spark-teacher-work-apply spark-teacher-feedbackform textareafield',
        gradePanel: 'spark-teacher-work-apply-gradepanel',
        readyBtn: 'spark-teacher-work-apply #readyForAssessBtn',
        readyHintCmp: 'spark-teacher-work-apply #readyHintCmp'
    },

    control: {
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
        controller: {
            '#': {
                activestudentselect: 'onActiveStudentSelect'
            }
        },
        store: {
            '#work.Applies': {
                load: 'onAppliesStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // config handlers
    updateActiveStudent: function(activeStudent) {
        var store = this.getWorkAppliesStore(),
            proxy = store.getProxy();

        if (activeStudent) {
            // TODO: track dirty state of extraparams?
            proxy.setExtraParam('student_id', activeStudent.get('student_id'));
            proxy.setExtraParam('sparkpoint', activeStudent.get('sparkpoint'));
            store.load();
        }

        this.setActiveApply(null);
    },

    updateActiveApply: function(apply) {
        this.syncActiveApply();
    },


    // event handlers
    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onApplyCtActivate: function() {
        this.syncActiveApply();
    },

    onAppliesStoreLoad: function(appliesStore) {
        this.setActiveApply(appliesStore.query('selected', true).first() || null);
    },

    onFeedbackSendTap: function() {
        var activeStudent = this.getActiveStudent(),
            feedbackMessageField = this.getFeedbackMessageField(),
            message = (feedbackMessageField.getValue() || '').trim();

        if (!message) {
            Ext.Msg.alert('Feedback', 'Enter a message before sending feedback');
            return;
        }

        Ext.getStore('work.Feedback').add({
            student_id: activeStudent.getId(),
            sparkpoint: activeStudent.get('sparkpoint'),
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
        var student = this.getActiveStudent();

        if (!student.get('apply_finish_time')) {
            student.set('apply_finish_time', new Date());
            student.save();
        }
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            item = data.item,
            task, apply, activeApply;

        if (table == 'todos') {
            if (task = me.getWorkApplyTasksStore().getById(item.id)) {
                task.set(item, { dirty: false });
            }
        } else if (table == 'applies') {
            if (apply = me.getWorkAppliesStore().getById(item.fb_apply_id)) {
                apply.set({
                    reflection: item.reflection,
                    submissions: Ext.decode(item.submissions, true) || [],
                    grade: item.grade
                }, { dirty: false });

                if ((activeApply = me.getActiveApply()) && activeApply.getId() == apply.getId()) {
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
            student = me.getActiveStudent(),
            startTime = student && student.get('apply_start_time');

        if (!applyCt) {
            return;
        }

        if (apply) {
            me.getHeaderCmp().setData(applyData);

            me.getTimelineCmp().setData({
                start: startTime,
                finish: student && student.get('apply_finish_time'),
                estimate: startTime && Ext.Date.add(startTime, Ext.Date.DAY, 3)
            });

            me.getLinksCmp().setData(apply.get('links').map(function(link) {
                return {
                    title: link.title || link.url.replace(/^https?:\/\//, ''),
                    url: link.url
                };
            }));

            me.getWorkApplyTasksStore().loadData(apply.get('todos'));

            me.getReflectionCmp().setData(applyData);

            me.getSubmissionsView().getStore().loadData(apply.get('submissions'));

            me.getReadyHintCmp().setData(student.getData());

            me.getGradePanel().setGrade(apply.get('grade'));

            applyCt.show();
        } else {
            applyCt.hide();
        }
    }
});
