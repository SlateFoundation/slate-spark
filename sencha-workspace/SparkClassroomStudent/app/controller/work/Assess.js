/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Assess', {
    extend: 'Ext.app.Controller',


    config: {
        studentSparkpoint: null
    },


    stores: [
        'work.Assessments@SparkClassroom.store'
    ],

    refs: {
        assessCt: 'spark-student-work-assess',
        illuminateLauncher: 'spark-student-work-assess #illuminateLauncher',
        reflectionField: 'spark-student-work-assess #reflectionField',
        submitBtn: 'spark-student-work-assess button#submitBtn'
    },

    control: {
        assessCt: {
            activate: 'onAssessCtActivate'
        },
        illuminateLauncher: {
            launchclick: 'onIlluminateLaunchClick'
        },
        reflectionField: {
            change: 'onReflectionFieldChange'
        },
        submitBtn: {
            tap: 'onSubmitBtnTap'
        }
    },

    listen: {
        controller: {
            '#': {
                studentsparkpointload: 'onStudentSparkpointLoad'
            }
        },
        store: {
            '#work.Assessments': {
                load: 'onAssessmentsStoreLoad'
            }
        }
    },


    // config handlers
    updateStudentSparkpoint: function(studentSparkpoint) {
        var store = this.getWorkAssessmentsStore(),
           assessCt = this.getAssessCt();

        if (!studentSparkpoint) {
            return;
        }

        store.getProxy().setExtraParam('sparkpoint', studentSparkpoint.get('sparkpoint'));

        if (store.isLoaded() || (assessCt && assessCt.isPainted())) {
            store.load();
        }
    },


    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onAssessCtActivate: function(learnCt) {
        var assessmentsStore = this.getWorkAssessmentsStore();

        if (this.getStudentSparkpoint() && !assessmentsStore.isLoaded()) {
            assessmentsStore.load();
        }
    },

    onAssessmentsStoreLoad: function(assessmentsStore) {
        var rawData = assessmentsStore.getProxy().getReader().rawData || {};

        this.getReflectionField().setValue(rawData.reflection);
    },

    onIlluminateLaunchClick: function(launcher, ev) {
        var studentSparkpoint = this.getStudentSparkpoint();

        // TODO: disable/enable the button automatically
        if (!studentSparkpoint.get('apply_finish_time')) {
            Ext.Msg.alert('Not Ready', 'Wait until your apply has been graded before starting your assessment');
            ev.stopEvent();
            return;
        }

        if (!studentSparkpoint.get('assess_start_time')) {
            studentSparkpoint.set('assess_start_time', new Date());
            studentSparkpoint.save();
        }
    },

    onReflectionFieldChange: function(field, value, oldValue) {
        if (oldValue !== null) {
            this.writeReflection();
        }
    },

    onSubmitBtnTap: function() {
        var studentSparkpoint = this.getStudentSparkpoint();

        // TODO: disable/enable the button automatically
        if (!studentSparkpoint.get('assess_start_time')) {
            Ext.Msg.alert('Not Ready', 'You must launch Illuminate and complete your assessment as directed before submitting for grading');
            return;
        }

        if (!studentSparkpoint.get('assess_ready_time')) {
            studentSparkpoint.set('assess_ready_time', new Date());
            studentSparkpoint.save();
        }
    },


    // controller methods
    writeReflection: Ext.Function.createBuffered(function() {
        var me = this;

        Slate.API.request({
            method: 'PATCH',
            url: '/spark/api/work/assess',
            urlParams: {
                sparkpoint: me.getStudentSparkpoint().get('sparkpoint')
            },
            jsonData: {
                reflection: this.getReflectionField().getValue()
            }
        });
    }, 2000)
});