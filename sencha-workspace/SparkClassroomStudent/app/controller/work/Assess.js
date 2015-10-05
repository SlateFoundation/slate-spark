/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Assess', {
    extend: 'Ext.app.Controller',


    refs: {
        assessCt: 'spark-student-work-assess'
    },

    control: {
        assessCt: {
            activate: 'onAssessCtActivate'
        }
    },


    // event handlers
    onAssessCtActivate: function(learnCt) {
        var learnsStore = Ext.getStore('work.Learns');

        if (!learnsStore.isLoaded()) { // TODO: OR extraParamsDirty
            learnsStore.load();
        }
    }
});