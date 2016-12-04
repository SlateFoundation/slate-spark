Ext.define('SparkClassroomStudent.controller.work.Assess', {
    extend: 'Ext.app.Controller',


    stores: [
        'work.Assessments@SparkClassroom.store'
    ],

    refs: {
        appCt: 'spark-student-appct',

        assessCt: 'spark-student-work-assess',
        illuminateLauncher: 'spark-student-work-assess #illuminateLauncher',
        reflectionField: 'spark-student-work-assess #reflectionField',
        submitBtn: 'spark-student-work-assess button#submitBtn'
    },

    control: {
        appCt: {
            loadedstudentsparkpointchange: 'onLoadedStudentSparkpointChange',
            loadedstudentsparkpointupdate: 'onLoadedStudentSparkpointUpdate'
        },
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
        store: {
            '#work.Assessments': {
                load: 'onAssessmentsStoreLoad'
            }
        }
    },


    // event handlers
    onLoadedStudentSparkpointChange: function(appCt, studentSparkpoint) {
        var me = this,
            store = me.getWorkAssessmentsStore(),
            assessCt = me.getAssessCt();

        if (!studentSparkpoint) {
            return;
        }

        store.getProxy().setExtraParam('sparkpoint', studentSparkpoint.get('sparkpoint'));

        if (store.isLoaded() || (assessCt && assessCt.hasParent())) {
            store.load();
        }

        me.refreshSubmitBtn();
    },

    onLoadedStudentSparkpointUpdate: function() {
        this.refreshSubmitBtn();
    },

    onAssessCtActivate: function(learnCt) {
        var me = this,
            assessmentsStore = me.getWorkAssessmentsStore();

        if (me.getAppCt().getLoadedStudentSparkpoint() && !assessmentsStore.isLoaded()) {
            assessmentsStore.load();
        }

        me.refreshSubmitBtn();
    },

    onAssessmentsStoreLoad: function(assessmentsStore) {
        var rawData = assessmentsStore.getProxy().getReader().rawData || {};

        this.getReflectionField().setValue(rawData.reflection);
    },

    onIlluminateLaunchClick: function(launcher, ev) {
        var studentSparkpoint = this.getAppCt().getLoadedStudentSparkpoint();

        // TODO: disable/enable the button automatically
        if (!studentSparkpoint.get('apply_completed_time')) {
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
        var studentSparkpoint = this.getAppCt().getLoadedStudentSparkpoint();

        // TODO: disable/enable the button automatically
        if (!studentSparkpoint.get('assess_start_time')) {
            Ext.Msg.alert('Not Ready', 'You must launch Illuminate and complete your assessment as directed before submitting for grading');
            return;
        }

        if (!studentSparkpoint.get('assess_ready_time')) {
            studentSparkpoint.set('assess_ready_time', new Date());
            studentSparkpoint.save();
            this.refreshSubmitBtn();
        }
    },


    // controller methods
    refreshSubmitBtn: function() {
        var submitBtn = this.getSubmitBtn(),
            studentSparkpoint = this.getAppCt().getLoadedStudentSparkpoint(),
            assessReadyTime = studentSparkpoint && studentSparkpoint.get('assess_ready_time');

        if (!submitBtn || !studentSparkpoint) {
            return;
        }

        submitBtn.setDisabled(assessReadyTime || !studentSparkpoint.get('assess_start_time'));
        submitBtn.setText(assessReadyTime ? 'Submitted to Teacher' : submitBtn.config.text);
    },

    writeReflection: Ext.Function.createBuffered(function() {
        var me = this;

        Slate.API.request({
            method: 'PATCH',
            url: '/spark/api/work/assess',
            urlParams: {
                sparkpoint: me.getAppCt().getLoadedStudentSparkpoint().get('sparkpoint')
            },
            jsonData: {
                reflection: this.getReflectionField().getValue()
            }
        });
    }, 2000)
});