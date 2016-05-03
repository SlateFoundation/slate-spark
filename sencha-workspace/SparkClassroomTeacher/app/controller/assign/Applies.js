/**
 * Manages the applies tab of the assign feature
 *
 * ## Responsibilities
 * - Activate applies container on /assign/conference route
 * - Load data into grid based on selected sparkpoint
 * - Handle realtime events indicating changes to assignments
 */
Ext.define('SparkClassroomTeacher.controller.assign.Applies', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.MessageBox',
        'Slate.API'
    ],


    stores: [
        'assign.Applies'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
        assignCt: 'spark-teacher-assign-ct',
        appliesCt: 'spark-assign-apply',
        popupHostColumn: 'spark-assign-apply spark-studentassignmentspanel ^ spark-column-assignments',
        applyForm: 'spark-assign-apply spark-panel',
        applyFormInstructions: 'spark-assign-apply-form textareafield#instructions',
        applyFormHours: 'spark-assign-apply-form textfield#hours',
        applyFormMinutes: 'spark-assign-apply-form textfield#minutes',
        applyFormTodos: 'spark-assign-apply-form fieldset#todos',
        applyFormLinks: 'spark-assign-apply-form fieldset#links'
    },

    control: {
        assignCt: {
            selectedsparkpointchange: 'onSelectedSparkpointChange'
        },
        appliesCt: {
            activate: 'onAppliesCtActivate'
        },
        'spark-assign-apply gridcell': {
            flagtap: 'onFlagTap'
        },
        'spark-assign-apply-grid': {
            applytap: 'onApplyTap'
        }
    },

    listen: {
        store: {
            '#assign.Applies': {
                load: 'onAppliesStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // event handlers
    onSelectedSparkpointChange: function(assignCt, sparkpoint) {
        var me = this,
            appliesStore = this.getAssignAppliesStore(),
            appliesCt = this.getAppliesCt(),
            applyForm = me.getApplyForm();

        if (!sparkpoint) {
            appliesStore.removeAll();
            return;
        }

        appliesStore.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // load store if it's loaded already or the grid is visible
        if (appliesStore.isLoaded() || (appliesCt && appliesCt.hasParent())) {
            // TODO: put load in here?
        }

        appliesStore.load();

        if (applyForm) {
            applyForm.setHidden(true);
        }

        me.syncSelectedSparkpoint();
    },

    onAppliesCtActivate: function() {
        var appliesStore = this.getAssignAppliesStore();

        // load store if it's not loaded already and a sparkpoint is selected
        if (!appliesStore.isLoaded() && this.getAssignCt().getSelectedSparkpoint()) {
            appliesStore.load();
        }

        this.syncSelectedSparkpoint();
    },

    onApplyTap: function(grid, item) {
        var me = this,
            applyData = item.getRecord().getData(),
            applyForm = me.getApplyForm(),
            applyFormTodos = me.getApplyFormTodos(),
            applyFormLinks = me.getApplyFormLinks(),
            todosLength = applyData.todos.length,
            linksLength = applyData.links.length,
            i = 0;

            applyForm.setTitle(applyData.title);
            me.getApplyFormInstructions().setValue(applyData.instructions);
            me.getApplyFormHours().setValue(Math.floor(applyData.timeEstimate / 60));
            me.getApplyFormMinutes().setValue(applyData.timeEstimate % 60);

            applyFormTodos.removeAll();
            for (; i < todosLength; i++) {
                applyFormTodos.add(Ext.create('Ext.field.Text', {
                    value: applyData.todos[i].todo,
                    readOnly: true,
                    clearIcon: false
                }));
            }

            applyFormLinks.removeAll();
            for (i = 0; i < linksLength; i++) {
                applyFormLinks.add(Ext.create('Ext.field.Text', {
                    value: applyData.links[i].url,
                    readOnly: true,
                    clearIcon: false
                }));
            }

            applyForm.setHidden(false);
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

                        studentDeletes.push({
                            sparkpoint: sparkpoint,
                            section: section,
                            student_id: null,
                            resource_id: resourceId,
                            assignment: null
                        });

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

    onAppliesStoreLoad: function(store, records, success, operation) {
        var responseData;

        if (!success) {
            responseData = Ext.decode(operation.getError().response.responseText, true) || {};
            store.removeAll();
            Ext.Msg.alert('Applies not loaded', responseData.error || 'Failed to fetch applies from server');
        }
    },

    onSocketData: function(socket, data) {
        if (data.table != 'apply_assignments_section' && data.table != 'apply_assignments_student') {
            return;
        }

        var me = this,
            appliesStore = me.getAssignAppliesStore(),
            itemData = data.item,
            studentId = itemData.student_id,
            assignment = itemData.assignment || null,
            apply = appliesStore.getById(itemData.resource_id),
            assignments = {},
            popupHostColumn, popup, popupStudent,
            popupStore, popupStudentsCount, i = 0;

        if (
            !apply
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
        apply.set('assignments', Ext.applyIf(assignments, apply.get('assignments')));
    },


    // controller methods
    syncSelectedSparkpoint: function() {
        var me = this,
            appliesCt = me.getAppliesCt(),
            sparkpoint = me.getAssignCt().getSelectedSparkpoint();

        if (!appliesCt || !appliesCt.hasParent()) {
            return;
        }

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        if (sparkpoint) {
            appliesCt.show();
        } else {
            appliesCt.hide();
        }
    },

    writeAssignments: function(assignmentsData) {
        Slate.API.request({
            method: 'POST',
            url: '/spark/api/assignments/applies',
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