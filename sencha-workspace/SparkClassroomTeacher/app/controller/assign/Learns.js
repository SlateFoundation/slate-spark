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
    requires: [
        'Ext.MessageBox',
        'Slate.API'
    ],


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
        },
        'spark-teacher-assign-learns-grid gridcell': {
            flagtap: 'onFlagTap'
        }
    },

    listen: {
        store: {
            '#assign.Learns': {
                load: 'onLearnsStoreLoad'
            }
        },
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

    onFlagTap: function(assignmentsCell, flagId, record, parentRecord, flagEl) {
        Slate.API.request({
            method: 'POST',
            url: '/spark/api/assignments/learns',
            jsonData: {
                sparkpoint: this.getAssignCt().getSelectedSparkpoint(),
                section: 'Geometry', // TODO: replace with dynamic value after merging appcontainer branch
                student_id: parentRecord ? record.get('student_id') : null,
                resource_id: parentRecord ? parentRecord.getId() : record.getId(),
                assignment: flagId
            },
            success: function(response) {
                // do nothing cause realtime will handle it
            },
            failure: function(response) {
                var error = response.data.error;

                // this structure is a mess to access safely..
                error = error && error[0];
                error = error && error.errors;
                error = error && error.join('</li><li>');
                error = error || 'Unknown problem';

                Ext.Msg.alert('Assignment not saved', 'This assignment could not be saved:<ul><li>'+error+'</li></ul>');
            }
        });
    },

    onLearnsStoreLoad: function(store, records, success, operation) {
        var responseData;

        if (!success) {
            responseData = Ext.decode(operation.getError().response.responseText, true) || {};
            store.removeAll();
            Ext.Msg.alert('Learns not loaded', responseData.error || 'Failed to fetch learns from server');
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