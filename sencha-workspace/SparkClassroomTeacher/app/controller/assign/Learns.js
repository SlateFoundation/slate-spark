/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * Manages the learns tab of the assign feature
 *
 * ## Responsibilities
 * - Activate learns container on /assign/learns route
 * - Load data into grid based on selected sparkpoint
 * - Handle realtime events indicating changes to assignments
 */
Ext.define('SparkClassroomTeacher.controller.assign.Learns', {
    extend: 'Ext.app.Controller',


    stores: [
        'assign.Learns'
    ],

    refs: {
        assignCt: 'spark-teacher-assign-ct',
        learnsCt: 'spark-teacher-assign-learns'
    },

    control: {
        assignCt: {
            selectedsparkpointchange: 'onSelectedSparkpointChange'
        },
        learnsCt: {
            activate: 'onLearnsCtActivate'
        }
    },

    listen: {
        // store: {
        //     '#gps.ActiveStudents': {
        //         update: 'onActiveStudentUpdate'
        //     },
        //     '#work.Learns': {
        //         load: 'onLearnsStoreLoad',
        //         update: 'onLearnsStoreUpdate'
        //     }
        // },
        socket: {
            data: 'onSocketData'
        }
    },


    // event handlers
    onSelectedSparkpointChange: function(assignCt, sparkpoint) {
        var learnsStore = this.getAssignLearnsStore(),
            learnsCt = this.getLearnsCt();

        learnsStore.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // load store if it's loaded already or the grid is visible
        if (learnsStore.isLoaded() || (learnsCt && learnsCt.hasParent())) {
            learnsStore.load();
        }
    },

    onLearnsCtActivate: function() {
        var learnsStore = this.getAssignLearnsStore();

        // load store if it's not loaded already and a sparkpoint is selected
        if (!learnsStore.isLoaded() && this.getAssignCt().getSelectedSparkpoint()) {
            learnsStore.load();
        }
    },

    onSocketData: function(socket, data) {
        // if (data.table != 'xxxx') {
        //     return;
        // }

        // var me = this;
    },


    // controller methods
});