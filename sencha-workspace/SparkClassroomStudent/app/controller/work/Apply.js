/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Apply', {
    extend: 'Ext.app.Controller',

    config: {
        activeSparkpoint: null
    },

    stores: [
        'work.Applies@SparkClassroom.store'
    ],

    refs: {
        applyCt: 'spark-student-work-apply'
    },

    control: {
        applyCt: {
            activate: 'onApplyCtActivate'
        }
    },

    // TODO: handle loading data into apply section
    onApplyCtActivate: function() {
        var me = this;

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints

    }
});
