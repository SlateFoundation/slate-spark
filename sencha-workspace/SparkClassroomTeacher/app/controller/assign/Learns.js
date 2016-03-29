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


    config: {
        selectedSection: null
    },

    stores: [
        'assign.Learns'
    ],

    refs: {
        assignCt: 'spark-teacher-assign-ct',
        learnsCt: 'spark-teacher-assign-learns',
        popupHostColumn: 'spark-teacher-assign-learns-grid spark-assign-popup ^ spark-column-assignments'
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
        controller: {
            '#': {
                sectionselect: 'onSectionSelect'
            }
        },
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

        if (!sparkpoint) {
            learnsStore.removeAll();
            return;
        }

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
        var me = this,
            popupHostColumn = me.getPopupHostColumn(),
            section = me.getSelectedSection(),
            sparkpoint = me.getAssignCt().getSelectedSparkpoint(),
            resourceId = parentRecord ? parentRecord.getId() : record.getId(),
            popupCell, assignments, studentIdStrings, assignmentKey,
            studentExempts = [];

        // close popup if clicking section-level flag on a different resource
        if (
            !parentRecord
            && popupHostColumn
            && (popupCell = popupHostColumn.getPopupCell())
            && popupCell.getRecord() !== record
        ) {
            popupHostColumn.setPopupCell(null);
        }

        // treat click on already-set section-level assignment as unset
        if (
            !parentRecord
            && (assignments = record.get('assignments'))
            && assignments.section == flagId
        ) {
            // erase all student-level prefs instead if there are any
            studentIdStrings = Ext.getStore('Students').getStudentIdStrings();

            for (assignmentKey in assignments) {
                // skip section assignment or students not in current roster
                if (
                    assignmentKey == 'section'
                    || studentIdStrings.indexOf(assignmentKey) == -1
                    || assignments[assignmentKey] == 'exempt'
                ) {
                    continue;
                }

                studentExempts.push({
                    sparkpoint: sparkpoint,
                    section: section,
                    student_id: assignmentKey,
                    resource_id: resourceId,
                    assignment: 'exempt'
                });
            }

            // if there are no student-level exempts to be saved, exempt the section
            if (studentExempts.length == 0) {
                flagId = 'exempt';
            }
        }

        Slate.API.request({
            method: 'POST',
            url: '/spark/api/assignments/learns',
            jsonData:
                studentExempts.length
                ? studentExempts
                : {
                    sparkpoint: sparkpoint,
                    section: section,
                    student_id: parentRecord ? record.get('student').getId() : null,
                    resource_id: resourceId,
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

    onSectionSelect: function(section) {
        this.setSelectedSection(section);
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
        if (data.table != 'learn_assignments_section' && data.table != 'learn_assignments_student') {
            return;
        }

        var me = this,
            learnsStore = me.getAssignLearnsStore(),
            itemData = data.item,
            studentId = itemData.student_id,
            assignment = itemData.assignment,
            learn = learnsStore.getById(itemData.resource_id),
            assignments = {},
            popupHostColumn, popup, popupStudent,
            popupStore, popupStudentsCount, i = 0;

        if (
            !learn
            || itemData.section_code != me.getSelectedSection()
            || itemData.sparkpoint_code != me.getAssignCt().getSelectedSparkpoint()
        ) {
            return;
        }

        if (studentId) {
            assignments[studentId] = assignment;

            // update `student` assignments in student-level store if open
            if (
                (popupHostColumn = me.getPopupHostColumn()) &&
                (popup = popupHostColumn.getPopup()) &&
                (popupStudent = popup.getGrid().getStore().getById(studentId))
            ) {
                popupStudent.set('assignments', Ext.applyIf({student: assignment}, popupStudent.get('assignments')));
            }
        } else {
            assignments.section = assignment;

            // update `seciton` assignment student-level store if open
            if (
                (popupHostColumn = me.getPopupHostColumn()) &&
                (popup = popupHostColumn.getPopup())
            ) {
                popupStore = popup.getGrid().getStore();
                popupStudentsCount = popupStore.getCount();

                for (; i < popupStudentsCount; i++) {
                    popupStudent = popupStore.getAt(i);
                    popupStudent.set('assignments', Ext.applyIf({section: assignment}, popupStudent.get('assignments')));
                }
            }
        }

        // copy old values into new assignments object and set
        learn.set('assignments', Ext.applyIf(assignments, learn.get('assignments')));
    }
});