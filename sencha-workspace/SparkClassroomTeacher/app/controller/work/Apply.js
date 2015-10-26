/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Apply', {
    extend: 'Ext.app.Controller',


    config: {
        activeStudent: null
    },

    stores: [
        'work.Applies@SparkClassroom.store'
    ],

    refs: {
        applyCt: 'spark-teacher-work-apply',
        readyBtn: 'spark-teacher-work-apply #readyForAssessBtn'
    //     applyCt: 'spark-student-work-apply',
    //     applyPickerCt: 'spark-student-work-apply #applyPickerCt',
    //     appliesGrid: 'spark-student-work-apply grid#appliesGrid',
    //     chooseSelectedApplyBtn: 'spark-student-work-apply button#chooseSelectedApplyBtn',
    //     selectedApplyCt: 'spark-student-work-apply #selectedApplyCt',
    //     chooseAgainBtn: 'spark-student-work-apply button#chooseAgainBtn',
    //     headerCmp: 'spark-student-work-apply #headerCmp',
    //     todosGrid: 'spark-student-work-apply grid#todosGrid',
    //     linksCmp: 'spark-student-work-apply #linksCmp'
    },

    control: {
        applyCt: {
            activate: 'onApplyCtActivate'
        },
        readyBtn: {
            tap: 'onReadyBtnTap'
        }
    //     applyCt: {
    //         activate: 'onApplyCtActivate'
    //     },
    //     appliesGrid: {
    //         select: 'onAppliesGridSelect'
    //     },
    //     chooseSelectedApplyBtn: {
    //         tap: 'onChooseSelectedApplyTap'
    //     },
    //     chooseAgainBtn: {
    //         tap: 'onChooseAgainTap'
    //     }
    },

    listen: {
        controller: {
            '#': {
                activestudentselect: 'onActiveStudentSelect'
            }
        }
    },


    // config handlers
    updateActiveStudent: function(activeStudent) {
        var store = this.getWorkAppliesStore(),
            proxy = store.getProxy();

        // TODO: track dirty state of extraparams?
        proxy.setExtraParam('student_id', activeStudent.get('student_id'));
        proxy.setExtraParam('sparkpoint', activeStudent.get('sparkpoint'));

        if (store.isLoaded()) {
            store.load();
        }

        this.syncActiveStudent();
    },

    // updateActiveApply: function(apply) {
    //     var me = this,
    //         applyPickerCt = me.getApplyPickerCt(),
    //         selectedApplyCt = me.getSelectedApplyCt();

    //     if (apply) {
    //         me.getTodosGrid().getStore().loadData(apply.get('todos').map(function(todo) {
    //             return {
    //                 todo: todo,
    //                 date_due: new Date()
    //             };
    //         }));

    //         me.getLinksCmp().setData(apply.get('links').map(function(link) {
    //             return {
    //                 title: link.title || link.url.replace(/^https?:\/\//, ''),
    //                 url: link.url
    //             };
    //         }));

    //         me.getHeaderCmp().setData(apply.getData());
    //     }

    //     applyPickerCt.setHidden(apply);
    //     selectedApplyCt.setHidden(!apply);
    // },


    // event handlers
    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onApplyCtActivate: function() {
        this.syncActiveStudent();
    },

    onReadyBtnTap: function() {
        var student = this.getActiveStudent();

        if (!student.get('apply_finish_time')) {
            student.set('apply_finish_time', new Date());
            student.save();
        }
    },

    // onSparkpointSelect: function(sparkpoint) {
    //     this.setActiveSparkpoint(sparkpoint);
    // },


    // // TODO: handle loading data into apply section
    // onApplyCtActivate: function() {
    //     var store = this.getWorkAppliesStore();

    //     // TODO: reload store if sparkpoints param dirty
    //     if (!store.isLoaded()) {
    //         store.load();
    //     }
    // },

    // onAppliesGridSelect: function(appliesGrid) {
    //     this.getChooseSelectedApplyBtn().enable();
    // },

    // onChooseSelectedApplyTap: function() {
    //     this.setActiveApply(this.getAppliesGrid().getSelection());
    // },

    // onChooseAgainTap: function() {
    //     this.setActiveApply(null);
    // }

    // controller methods
    syncActiveStudent: function() {
        var me = this,
            applyCt = me.getApplyCt(),
            student = me.getActiveStudent();

        if (!applyCt) {
            return;
        }

        applyCt.setHidden(!student);
    }
});
