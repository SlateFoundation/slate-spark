/* global Slate */
/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Apply', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.field.Url' // TODO: remove when attach link window is build
    ],


    config: {
        studentSparkpoint: null,
        activeApply: null,
        renderedApply: null
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
        attachFileButton: 'spark-student-work-apply button#attachFileBtn',
        attachLinkBtn: 'spark-student-work-apply button#attachLinkBtn',
        submitBtn: 'spark-student-work-apply button#submitBtn'
    },

    control: {
        applyCt: {
            activate: 'onApplyCtActivate'
        },
        appliesGrid: {
            selectionchange: 'onAppliesGridSelectionChange'
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
        },
        submitBtn: {
            tap: 'onSubmitBtnTap'
        }
    },

    listen: {
        controller: {
            '#': {
                studentsparkpointload: 'onStudentSparkpointLoad',
                studentsparkpointupdate: 'onStudentSparkpointUpdate'
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
            store = me.getWorkAppliesStore();

        me.setActiveApply(null);
        store.removeAll();

        if (!studentSparkpoint) {
            return;
        }

        store.getProxy().setExtraParam('sparkpoint', studentSparkpoint.get('sparkpoint'));
        store.load();

        me.refreshSubmitBtn();
    },

    updateActiveApply: function(apply, oldApply) {
        if (this.getApplyCt()) {
            this.setRenderedApply(apply);
        }

        if (oldApply) {
            oldApply.set('selected', false, { dirty: false });
        }
    },

    updateRenderedApply: function(apply) {
        var me = this,
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

            me.getAppliesGrid().setSelection(apply);
        }

        me.getApplyPickerCt().setHidden(apply);
        me.getSelectedApplyCt().setHidden(!apply);
    },


    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onStudentSparkpointUpdate: function() {
        this.refreshSubmitBtn();
        this.refreshChooseSelectedApplyBtn();
    },

    onApplyCtActivate: function() {
        var me = this;

        me.setRenderedApply(me.getActiveApply());
        me.refreshSubmitBtn();
    },

    onAppliesStoreLoad: function(appliesStore) {
        this.setActiveApply(appliesStore.query('selected', true).first() || null);
    },

    onAppliesGridSelectionChange: function() {
        this.refreshChooseSelectedApplyBtn();
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
            me.refreshChooseSelectedApplyBtn();
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

    onSubmitBtnTap: function() {
        var me = this,
            studentSparkpoint = me.getStudentSparkpoint();

        if (!studentSparkpoint.get('apply_ready_time')) {
            studentSparkpoint.set('apply_ready_time', new Date());
            studentSparkpoint.save();
            this.refreshSubmitBtn();
        }
    },


    // controller methods
    refreshChooseSelectedApplyBtn: function() {
        var me = this,
            chooseSelectedApplyBtn = me.getChooseSelectedApplyBtn(),
            studentSparkpoint = me.getStudentSparkpoint(),
            appliesGrid = me.getAppliesGrid(),
            gridSelection = appliesGrid && appliesGrid.getSelections()[0],
            applyStartTime = studentSparkpoint && studentSparkpoint.get('apply_start_time');

        if (!chooseSelectedApplyBtn || !studentSparkpoint) {
            return;
        }

        chooseSelectedApplyBtn.setDisabled(!studentSparkpoint.get('conference_finish_time') || !gridSelection);
        chooseSelectedApplyBtn.setText(
            applyStartTime ?
            (
                gridSelection && gridSelection.getId() === studentSparkpoint.get('selected_fb_apply_id') ?
                'Return to Selected Apply &rarr;' :
                'Switch to Selected Apply &rarr;'
            ) :
            chooseSelectedApplyBtn.config.text
        );
    },

    refreshSubmitBtn: function() {
        var submitBtn = this.getSubmitBtn(),
            studentSparkpoint = this.getStudentSparkpoint(),
            applyReadyTime = studentSparkpoint && studentSparkpoint.get('apply_ready_time');

        if (!submitBtn || !studentSparkpoint) {
            return;
        }

        submitBtn.setDisabled(applyReadyTime || !studentSparkpoint.get('apply_start_time'));
        submitBtn.setText(applyReadyTime ? 'Submitted to Teacher' : submitBtn.config.text);
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