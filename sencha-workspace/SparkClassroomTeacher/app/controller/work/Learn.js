/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.work.Learn', {
    extend: 'Ext.app.Controller',


    config: {
        activeStudent: null,
        activeSparkpoint: null
    },


    stores: [
        'work.Learns@SparkClassroom.store'
    ],

    refs: {
        learnCt: 'spark-teacher-work-learn',
        sparkpointCt: 'spark-teacher-work-learn #sparkpointCt',
        learnGrid: 'spark-work-learn-grid'
    },

    control: {
        learnCt: {
            activate: 'onLearnCtActivate'
        }
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
        var store = this.getWorkLearnsStore(),
            proxy = store.getProxy(),
            sparkpointCode = activeStudent.get('sparkpoint_code');

        this.setActiveSparkpoint(sparkpointCode);

        // TODO: track dirty state of extraparams?
        proxy.setExtraParam('student_id', activeStudent.get('user_id'));
        proxy.setExtraParam('sparkpoint', sparkpointCode);

        if (store.isLoaded()) {
            store.load();
        }

        this.syncActiveSparkpoint();
    },


    // event handlers
    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onLearnCtActivate: function() {
        this.syncActiveSparkpoint();
    },

    syncActiveSparkpoint: function() {
        var me = this,
            learnCt = me.getLearnCt(),
            store = me.getWorkLearnsStore(),
            sparkpoint = me.getActiveSparkpoint();

        if (!learnCt) {
            return;
        }

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        if (sparkpoint) {
            me.getSparkpointCt().setTitle(sparkpoint);
            learnCt.show();

            if (!store.isLoaded() && !store.isLoading()) { // TODO: OR extraParamsDirty
                store.load();
            }
        } else {
            learnCt.hide();
        }
    }
});
