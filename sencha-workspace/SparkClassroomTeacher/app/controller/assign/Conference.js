/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * Manages the conference quetions tab of the assign feature
 *
 * ## Responsibilities
 * - Activate conference questions container on /assign/conference route
 * - Load data into grid based on selected sparkpoint
 * - Handle realtime events indicating changes to assignments
 */
Ext.define('SparkClassroomTeacher.controller.assign.Conference', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.MessageBox',
        'Slate.API'
    ],


    stores: [
        'assign.Questions'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
        assignCt: 'spark-teacher-assign-ct',
        questionsCt: 'spark-teacher-assign-questions',
        popupHostColumn: 'spark-teacher-assign-questions-grid spark-studentassignmentspanel ^ spark-column-assignments'
    },

    control: {
        assignCt: {
            selectedsparkpointchange: 'onSelectedSparkpointChange'
        },
        questionsCt: {
            activate: 'onQuestionsCtActivate'
        },
        'spark-assign-questions gridcell': {
            flagtap: 'onFlagTap'
        }
    },

    listen: {
        store: {
            '#assign.Questions': {
                load: 'onQuestionsStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // event handlers
    onSelectedSparkpointChange: function(assignCt, sparkpoint) {
        var questionsStore = this.getAssignQuestionsStore(),
            questionsCt = this.getQuestionsCt();

        if (!sparkpoint) {
            questionsStore.removeAll();
            return;
        }

        questionsStore.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // load store if it's loaded already or the grid is visible
        if (questionsStore.isLoaded() || (questionsCt && questionsCt.hasParent())) {

            //debugger;
        }

        questionsStore.load();
    },

    onQuestionsCtActivate: function() {
        var questionsStore = this.getAssignQuestionsStore();

        // load store if it's not loaded already and a sparkpoint is selected
        if (!questionsStore.isLoaded() && this.getAssignCt().getSelectedSparkpoint()) {
            questionsStore.load();
        }
    },

    onFlagTap: function(assignmentsCell, flagId, record, parentRecord, flagEl) {
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
                    student_id: assignmentKey,
                    resource_id: resourceId,
                    assignment: null
                });
            }

            // if there are any student-level assignments, offer to erase them so there are no exceptions to this flag
            if (studentDeletes.length) {
                return Ext.Msg.confirm(
                    'Erase student-level assignments',
                    'Do you want to erase all student-level assignments for this resource so that the section-level assignment is effective for all students?',
                    function(buttonId) {
                        if (buttonId != 'yes') {
                            return;
                        }

                        me.writeAssignments(studentDeletes);
                    }
                );
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
            student_id: parentRecord ? record.get('student').getId() : null,
            resource_id: resourceId,
            assignment: flagId
        });
    },

    onQuestionsStoreLoad: function(store, records, success, operation) {
        var responseData;

        if (!success) {
            responseData = Ext.decode(operation.getError().response.responseText, true) || {};
            store.removeAll();
            Ext.Msg.alert('Questions not loaded', responseData.error || 'Failed to fetch conference questions from server');
        }
    },

    onSocketData: function(socket, data) {
        if (data.table != 'guiding_question_assignments_section' && data.table != 'guiding_question_assignments_student') {
            return;
        }
debugger;
        var me = this,
            questionsStore = me.getAssignQuestionsStore(),
            itemData = data.item,
            studentId = itemData.student_id,
            assignment = itemData.assignment || null,
            question = questionsStore.getById(itemData.resource_id),
            assignments = {},
            popupHostColumn, popup, popupStudent,
            popupStore, popupStudentsCount, i = 0;

        if (
            !question
            || itemData.section_code != me.getAppCt().getSelectedSection()
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
        question.set('assignments', Ext.applyIf(assignments, question.get('assignments')));
    },


    // controller methods
    writeAssignments: function(assignmentsData) {
        Slate.API.request({
            method: 'POST',
            url: '/spark/api/assignments/guiding_questions',
            jsonData: assignmentsData,
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
    }
});