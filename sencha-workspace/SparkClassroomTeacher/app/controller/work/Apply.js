/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Apply', {
    extend: 'Ext.app.Controller',


    config: {
        activeStudent: null,
        activeApply: null
    },

    stores: [
        'work.Applies@SparkClassroom.store'
    ],

    refs: {
        applyCt: 'spark-teacher-work-apply',
        headerCmp: 'spark-teacher-work-apply #headerCmp',
        timelineCmp: 'spark-teacher-work-apply #timelineCmp',
        linksCmp: 'spark-teacher-work-apply #linksCmp',
        tasksGrid: 'spark-teacher-work-apply spark-teacher-work-apply-tasksgrid',
        reflectionCmp: 'spark-teacher-work-apply #reflectionCmp',
        readyBtn: 'spark-teacher-work-apply #readyForAssessBtn'
    },

    control: {
        applyCt: {
            activate: 'onApplyCtActivate'
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
        }
    },


    // config handlers
    updateActiveStudent: function(activeStudent) {
        var store = this.getWorkAppliesStore(),
            proxy = store.getProxy();

        // TODO: track dirty state of extraparams?
        proxy.setExtraParam('student_id', activeStudent.get('student_id'));
        proxy.setExtraParam('sparkpoint', activeStudent.get('sparkpoint'));

        this.setActiveApply(null);
        store.load();
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

    onReadyBtnTap: function() {
        var student = this.getActiveStudent();

        if (!student.get('apply_finish_time')) {
            student.set('apply_finish_time', new Date());
            student.save();
        }
    },


    // controller methods
    syncActiveApply: function() {
        var me = this,
            applyCt = me.getApplyCt(),
            apply = me.getActiveApply(),
            student = me.getActiveStudent(),
            startTime = student && student.get('apply_start_time');

        if (apply) {
            me.getHeaderCmp().setData(apply.getData());

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

            me.getTasksGrid().getStore().loadData(apply.get('todos'));

            me.getReflectionCmp().setData(apply.getData());

            applyCt.show();
        } else {
            applyCt.hide();
        }
    }
});
