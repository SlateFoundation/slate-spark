/**
 * Manages the conference resources tab of the assign feature
 *
 * ## Responsibilities
 * - Activate conference resources container on /assign/conference route
 * - Load data into grid based on selected sparkpoint
 * - Handle realtime events indicating changes to assignments
 */
Ext.define('SparkClassroomTeacher.controller.assign.ConferenceResources', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.MessageBox',

        /* global Slate */
        'Slate.API'
    ],


    stores: [
        'assign.ConferenceResources'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
        assignCt: 'spark-teacher-assign-ct',
        resourcesCt: 'spark-assign-resources',
        popupHostColumn: 'spark-assign-resources spark-studentassignmentspanel ^ spark-column-assignments'
    },

    control: {
        assignCt: {
            selectedsparkpointchange: 'onSelectedSparkpointChange'
        },
        resourcesCt: {
            activate: 'onResourcesCtActivate'
        },
        'spark-assign-resources gridcell': {
            flagtap: 'onFlagTap'
        }
    },

    listen: {
        store: {
            '#assign.ConferenceResources': {
                load: 'onConferenceResourcesStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // event handlers
    onSelectedSparkpointChange: function(assignCt, sparkpoint) {
        var resourcesStore = this.getAssignConferenceResourcesStore(),
            resourcesCt = this.getResourcesCt();

        if (!sparkpoint) {
            resourcesStore.removeAll();
            return;
        }

        resourcesStore.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // load store if it's loaded already or the grid is visible
        if (resourcesStore.isLoaded() || (resourcesCt && resourcesCt.hasParent())) { // eslint-disable-line no-extra-parens
            // TODO put load in here?
        }

        resourcesStore.load();

        this.syncSelectedSparkpoint();
    },

    onResourcesCtActivate: function() {
        var resourcesStore = this.getAssignConferenceResourcesStore();

        // load store if it's not loaded already and a sparkpoint is selected
        if (!resourcesStore.isLoaded() && this.getAssignCt().getSelectedSparkpoint()) {
            resourcesStore.load();
        }

        this.syncSelectedSparkpoint();
    },

    onFlagTap: function(assignmentsCell, flagId, record, parentRecord) {
        var me = this,
            popupHostColumn = me.getPopupHostColumn(),
            section = me.getAppCt().getSelectedSection(),
            sparkpoint = me.getAssignCt().getSelectedSparkpoint(),
            resourceId = parentRecord ? parentRecord.getId() : record.getId(),
            popupCell, assignments, studentIdStrings, assignmentKey,
            studentDeletes = [];

        // close popup if clicking section-level flag on a different resource
        if (
            !parentRecord
            && popupHostColumn
            && (popupCell = popupHostColumn.getPopupCell())
            && popupCell.getRecord() !== record
        ) {
            popupHostColumn.setPopupCell(null);
        }

        // did the user click on a section-level flag that is already saved?
        if (
            !parentRecord
            && (assignments = record.get('assignments'))
            && assignments.section == flagId
        ) {
            // compile a list of any student-level assignments that could be erased
            studentIdStrings = Ext.getStore('Students').getStudentIdStrings();

            for (assignmentKey in assignments) {
                // skip section assignment or students not in current roster
                if (
                    assignmentKey == 'section'
                    || studentIdStrings.indexOf(assignmentKey) == -1
                    || !assignments[assignmentKey]
                ) {
                    continue;
                }

                studentDeletes.push({
                    sparkpoint: sparkpoint,
                    section: section,
                    'student_id': assignmentKey,
                    'resource_id': resourceId,
                    assignment: null
                });
            }

            // if there are any student-level assignments, offer to erase them so there are no exceptions to this flag
            if (studentDeletes.length) {
                Ext.Msg.confirm(
                    'Erase student-level assignments',
                    'Do you want to erase all student-level assignments for this resource so that the section-level assignment is effective for all students?',
                    function(buttonId) {
                        if (buttonId != 'yes') {
                            return;
                        }

                        studentDeletes.push({
                            sparkpoint: sparkpoint,
                            section: section,
                            'student_id': null,
                            'resource_id': resourceId,
                            assignment: null
                        });

                        me.writeAssignments(studentDeletes);
                    }
                );
                return;
            }

            // otherwise, erase the section-level assignment
            flagId = null;
        }

        // treat click on already-set student-level flag as unset
        if (
            parentRecord
            && (assignments = record.get('assignments'))
            && assignments.student == flagId
        ) {
            flagId = null;
        }

        me.writeAssignments({
            sparkpoint: sparkpoint,
            section: section,
            'student_id': parentRecord ? record.get('student').getId() : null,
            'resource_id': resourceId,
            assignment: flagId
        });
    },

    onConferenceResourcesStoreLoad: function(store, records, success, operation) {
        var responseData;

        if (!success) {
            responseData = Ext.decode(operation.getError().response.responseText, true) || {};
            store.removeAll();
            Ext.Msg.alert('Resources not loaded', responseData.error || 'Failed to fetch conference resources from server');
        }
    },

    onSocketData: function(socket, data) {
        if (data.table != 'conference_resource_assignments_section' && data.table != 'conference_resource_assignments_student') {
            return;
        }

        var me = this, // eslint-disable-line vars-on-top
            resourcesStore = me.getAssignConferenceResourcesStore(),
            itemData = data.item,
            studentId = itemData.student_id,
            assignment = itemData.assignment || null,
            resource = resourcesStore.getById(itemData.resource_id),
            assignments = {},
            popupHostColumn, popup, popupStudent,
            popupStore, popupStudentsCount, i = 0;

        if (
            !resource
            || itemData.section_code != me.getAppCt().getSelectedSection()
            || itemData.sparkpoint_code != me.getAssignCt().getSelectedSparkpoint()
        ) {
            return;
        }

        if (studentId) {
            assignments[studentId] = assignment;

            // update `student` assignments in student-level store if open
            if (
                (popupHostColumn = me.getPopupHostColumn())
                && (popup = popupHostColumn.getPopup())
                && (popupStudent = popup.getGrid().getStore().getById(studentId))
            ) {
                popupStudent.set('assignments', Ext.applyIf({ student: assignment }, popupStudent.get('assignments')));
            }
        } else {
            assignments.section = assignment;

            // update `seciton` assignment student-level store if open
            if (
                (popupHostColumn = me.getPopupHostColumn())
                && (popup = popupHostColumn.getPopup())
            ) {
                popupStore = popup.getGrid().getStore();
                popupStudentsCount = popupStore.getCount();

                for (; i < popupStudentsCount; i++) {
                    popupStudent = popupStore.getAt(i);
                    popupStudent.set('assignments', Ext.applyIf({ section: assignment }, popupStudent.get('assignments')));
                }
            }
        }

        // copy old values into new assignments object and set
        resource.set('assignments', Ext.applyIf(assignments, resource.get('assignments')));
    },


    // controller methods
    syncSelectedSparkpoint: function() {
        var me = this,
            resourcesCt = me.getResourcesCt(),
            sparkpoint = me.getAssignCt().getSelectedSparkpoint();

        if (!resourcesCt || !resourcesCt.hasParent()) {
            return;
        }

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        if (sparkpoint) {
            resourcesCt.show();
        } else {
            resourcesCt.hide();
        }
    },

    writeAssignments: function(assignmentsData) {
        Slate.API.request({
            method: 'POST',
            url: '/spark/api/assignments/conference_resources',
            jsonData: assignmentsData,
            success: function() {
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
    }
});