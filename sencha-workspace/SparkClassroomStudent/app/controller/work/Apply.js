/* global Slate */
/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Apply', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.field.Url' // TODO: remove when attach link window is build
    ],


    config: {
        studentSparkpoint: null,
        activeApply: null
    },

    stores: [
        'work.Applies@SparkClassroom.store',
        'work.ApplyTasks@SparkClassroom.store'
    ],

    refs: {
        applyCt: 'spark-student-work-apply',
        applyPickerCt: 'spark-student-work-apply #applyPickerCt',
        appliesGrid: 'spark-student-work-apply grid#appliesGrid',
        reflectionField: 'spark-student-work-apply #reflectionField',
        chooseSelectedApplyBtn: 'spark-student-work-apply button#chooseSelectedApplyBtn',
        selectedApplyCt: 'spark-student-work-apply #selectedApplyCt',
        chooseAgainBtn: 'spark-student-work-apply button#chooseAgainBtn',
        headerCmp: 'spark-student-work-apply #headerCmp',
        timelineCmp: 'spark-student-work-apply #timelineCmp',
        tasksGrid: 'spark-student-work-apply spark-work-apply-tasksgrid',
        linksCmp: 'spark-student-work-apply #linksCmp',
        submissionsView: 'spark-student-work-apply #submissionsView',
        attachFileButton: 'spark-panel button#attachFileBtn',
        attachLinkBtn: 'spark-panel button#attachLinkBtn'
    },

    control: {
        applyCt: {
            activate: 'onApplyCtActivate'
        },
        appliesGrid: {
            select: 'onAppliesGridSelect'
        },
        reflectionField: {
            change: 'onReflectionFieldChange'
        },
        chooseSelectedApplyBtn: {
            tap: 'onChooseSelectedApplyTap'
        },
        chooseAgainBtn: {
            tap: 'onChooseAgainTap'
        },
        attachFileButton: {
            tap: 'onAttachFileBtnTap'
        },
        attachLinkBtn: {
            tap: 'onAttachLinkBtnTap'
        }
    },

    listen: {
        controller: {
            '#': {
                studentsparkpointload: 'onStudentSparkpointLoad'
            }
        },
        store: {
            '#work.Applies': {
                load: 'onAppliesStoreLoad'
            }
        }
    },


    // config handlers
    updateStudentSparkpoint: function(studentSparkpoint) {
        var me = this,
            store = me.getWorkAppliesStore(),
            applyCt = me.getApplyCt();

        store.getProxy().setExtraParam('sparkpoint', studentSparkpoint.get('sparkpoint'));

        if (store.isLoaded() || (applyCt && applyCt.isPainted())) {
            me.setActiveApply(null);
            store.removeAll();
            store.load();
        }
    },

    updateActiveApply: function() {
        this.syncActiveApply();
    },


    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },


    // TODO: handle loading data into apply section
    onApplyCtActivate: function() {
        var store = this.getWorkAppliesStore();

        if (this.getStudentSparkpoint() && !store.isLoaded()) {
            store.load();
        }
    },

    onAppliesStoreLoad: function(appliesStore) {
        this.setActiveApply(appliesStore.query('selected', true).first() || null);
    },

    onAppliesGridSelect: function(appliesGrid) {
        this.getChooseSelectedApplyBtn().enable();
    },

    onReflectionFieldChange: function() {
        this.writeReflection();
    },

    onChooseSelectedApplyTap: function() {
        var me = this,
            apply = me.getAppliesGrid().getSelection(),
            studentSparkpoint = me.getStudentSparkpoint();

        me.setActiveApply(apply);

        apply.set('selected', true);

        if (apply.dirty) {
            apply.save({
                success: function() {
                    me.getTasksGrid().getStore().loadData(apply.get('todos'));
                }
            });
        }

        if (!studentSparkpoint.get('apply_start_time')) {
            studentSparkpoint.set('apply_start_time', new Date());
            studentSparkpoint.save();
        }
    },

    onChooseAgainTap: function() {
        this.setActiveApply(null);
    },

    onAttachFileBtnTap: function() {
        //console.log('onAttachFileButtonTap');
    },

    onAttachLinkBtnTap: function() {
        var me = this,
            apply = me.getActiveApply();

        // TODO: build a custom window that enables inputting link+title
        Ext.Msg.show({
            title: 'Attach link',
            message: 'Paste the link you wish to attach',
            buttons  : Ext.MessageBox.OKCANCEL,
            prompt: {
                xtype: 'urlfield',
                placeHolder: 'http://...'
            },
            fn: function(btnId, url) {
                if (btnId != 'ok') {
                    return;
                }

                Slate.API.request({
                    method: 'POST',
                    url: '/spark/api/work/applies/submissions',
                    jsonData: {
                        sparkpoint: apply.get('sparkpoint'),
                        id: apply.getId(),
                        url: url
                    },
                    success: function(response) {
                        me.getSubmissionsView().getStore().loadData(response.data.submissions);
                    }
                });
            }
        }).down('field').focus();
    },


    // controller methods
    syncActiveApply: function() {
        var me = this,
            applyPickerCt = me.getApplyPickerCt(),
            selectedApplyCt = me.getSelectedApplyCt(),
            apply = me.getActiveApply(),
            studentSparkpoint = me.getStudentSparkpoint(),
            startTime = studentSparkpoint && studentSparkpoint.get('apply_start_time');

        if (apply) {
            me.getHeaderCmp().setData(apply.getData());

            me.getTimelineCmp().setData({
                start: startTime,
                finish: studentSparkpoint && studentSparkpoint.get('apply_finish_time'),
                estimate: startTime && Ext.Date.add(startTime, Ext.Date.DAY, 3)
            });

            apply.set('sparkpoint', studentSparkpoint.get('sparkpoint'), { dirty: false });

            me.getWorkApplyTasksStore().loadData(apply.get('todos'));

            me.getLinksCmp().setData(apply.get('links').map(function(link) {
                return {
                    title: link.title || link.url.replace(/^https?:\/\//, ''),
                    url: link.url
                };
            }));

            me.getReflectionField().setValue(apply.get('reflection'));

            me.getSubmissionsView().getStore().loadData(apply.get('submissions'));
        }

        applyPickerCt.setHidden(apply);
        selectedApplyCt.setHidden(!apply);
    },

    writeReflection: Ext.Function.createBuffered(function() {
        var apply = this.getActiveApply();

        if (!apply) {
            return;
        }

        apply.set('reflection', this.getReflectionField().getValue());

        if (apply.dirty) {
            apply.save();
        }
    }, 2000)
});