Ext.define('SparkClassroomStudent.controller.work.Apply', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.field.Url', // TODO: remove when attach link window is build

        /* global Slate */
        'Slate.API'
    ],


    config: {
        activeApply: null,
        renderedApply: null
    },

    stores: [
        'work.Applies@SparkClassroom.store',
        'work.ApplyTasks@SparkClassroom.store'
    ],

    refs: {
        appCt: 'spark-student-appct',

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
        appCt: {
            loadedstudentsparkpointchange: 'onLoadedStudentSparkpointChange',
            loadedstudentsparkpointupdate: 'onLoadedStudentSparkpointUpdate'
        },
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
        store: {
            '#work.Applies': {
                load: 'onAppliesStoreLoad',
                update: 'onAppliesStoreUpdate'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // config handlers
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
            studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint(),
            startTime = studentSparkpoint && studentSparkpoint.get('apply_start_time');

        if (apply) {
            me.getHeaderCmp().setData(apply.getData());

            me.getTimelineCmp().setData({
                start: startTime,
                finish: studentSparkpoint && studentSparkpoint.get('apply_completed_time'),
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
    onLoadedStudentSparkpointChange: function(appCt, studentSparkpoint) {
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

    onLoadedStudentSparkpointUpdate: function() {
        this.refreshSubmitBtn();
        this.refreshChooseSelectedApplyBtn();
    },

    onApplyCtActivate: function() {
        var me = this;

        me.setRenderedApply(me.getActiveApply());
        me.refreshSubmitBtn();
    },

    onAppliesStoreLoad: function() {
        this.filterApplies();
    },

    onAppliesStoreUpdate: function() {
        this.filterApplies();
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
            studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint();

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
        // console.log('onAttachFileButtonTap');
    },

    onAttachLinkBtnTap: function() {
        var me = this,
            apply = me.getActiveApply();

        // TODO: build a custom window that enables inputting link+title
        Ext.Msg.show({
            title: 'Attach link',
            message: 'Paste the link you wish to attach',
            buttons: Ext.MessageBox.OKCANCEL,
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
            studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint();

        if (!studentSparkpoint.get('apply_ready_time')) {
            studentSparkpoint.set('apply_ready_time', new Date());
            studentSparkpoint.save();
            this.refreshSubmitBtn();
        }
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            itemData = data.item,
            apply;

        if (table == 'apply_assignments_student') {
            apply = me.getWorkAppliesStore().getById(itemData.resource_id);

            if (apply) {
                // we're only getting data back for student level assignments so much preserve previous section data
                if (itemData.assignment) {
                    apply.set('assignments', {
                        section: apply.data.assignments.section || null,
                        student: 'required'
                    });
                } else {
                    apply.set('assignments', {
                        section: apply.data.assignments.section || null
                    });
                }
            }
        } else if (table == 'apply_assignments_section') {
            apply = me.getWorkAppliesStore().getById(itemData.resource_id);

            if (apply) {
                // we're only getting data back for section level assignments so much preserve previous student data
                if (itemData.assignment) {
                    apply.set('assignments', {
                        section: 'required',
                        student: apply.data.assignments.student || null
                    });
                } else {
                    apply.set('assignments', {
                        student: apply.data.assignments.student || null
                    });
                }
            }
        }
    },


    // controller methods
    refreshChooseSelectedApplyBtn: function() {
        var me = this,
            chooseSelectedApplyBtn = me.getChooseSelectedApplyBtn(),
            studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint(),
            appliesGrid = me.getAppliesGrid(),
            gridSelection = appliesGrid && appliesGrid.getSelections()[0],
            applyStartTime = studentSparkpoint && studentSparkpoint.get('apply_start_time'),
            chooseText;

        if (!chooseSelectedApplyBtn || !studentSparkpoint) {
            return;
        }

        if (applyStartTime) {
            if (gridSelection && gridSelection.getId() === studentSparkpoint.get('selected_apply_resource_id')) {
                chooseText = 'Return to Selected Apply &rarr;';
            } else {
                chooseText = 'Switch to Selected Apply &rarr;';
            }
        } else {
            chooseText = chooseSelectedApplyBtn.config.text;
        }

        chooseSelectedApplyBtn.setDisabled(!gridSelection);
        chooseSelectedApplyBtn.setText(chooseText);
    },

    refreshSubmitBtn: function() {
        var submitBtn = this.getSubmitBtn(),
            studentSparkpoint = this.getAppCt().getLoadedStudentSparkpoint(),
            applyReadyTime = studentSparkpoint && studentSparkpoint.get('apply_ready_time');

        if (!submitBtn || !studentSparkpoint) {
            return;
        }

        submitBtn.setDisabled(applyReadyTime || !studentSparkpoint.get('conference_completed_time') || !studentSparkpoint.get('apply_start_time'));
        submitBtn.setText(applyReadyTime ? 'Submitted to Teacher' : submitBtn.config.text);
    },

    filterApplies: function() {
        var me = this,
            filters = [],
            appliesStore = me.getWorkAppliesStore(),
            appliesGrid = me.getAppliesGrid();

        if (appliesStore.query('effective_assignment', 'required').getCount()) {
            filters.push({
                property: 'effective_assignment',
                value: 'required'
            });
        }

        appliesStore.clearFilter(true);
        appliesStore.filter(filters);

        // TODO: remove this #hack when underlying #framework-bug gets fixed
        if (appliesGrid) {
            appliesGrid.refresh();
        }

        me.setActiveApply(appliesStore.query('selected', true).first() || null);
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