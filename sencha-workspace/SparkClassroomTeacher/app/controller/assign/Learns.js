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

        /* global Slate */
        'Slate.API'
    ],


    stores: [
        'assign.Learns'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
        assignCt: 'spark-teacher-assign-ct',
        learnsCt: 'spark-teacher-assign-learns',
        popupHostColumn: 'spark-teacher-assign-learns-grid spark-studentassignmentspanel ^ spark-column-assignments',
        popupRequiredLearns: 'spark-teacher-assign-learns spark-teacher-assign-learns-learnsrequiredfield'
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
        },
        'spark-teacher-assign-learns spark-teacher-assign-learns-learnsrequiredfield': {
            change: {
                fn: 'onMinimumChangeSection',
                buffer: 500
            }
        },
        'spark-studentlearnsrequiredpanel numberfield': {
            minimumchange: 'onMinimumChange'
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
        var me = this,
            learnsStore = me.getAssignLearnsStore(),
            learnsCt = me.getLearnsCt();

        if (!sparkpoint) {
            learnsStore.removeAll();
            return;
        }

        learnsStore.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // load store if it's loaded already or the grid is visible
        if (learnsStore.isLoaded() || (learnsCt && learnsCt.hasParent())) { // eslint-disable-line no-extra-parens
            learnsStore.load();
        }

        me.syncSelectedSparkpoint();
        if (me.getPopupRequiredLearns()) {
            me.getPopupRequiredLearns().setPopupVisible(false);
        }
    },

    onLearnsCtActivate: function() {
        var learnsStore = this.getAssignLearnsStore();

        // load store if it's not loaded already and a sparkpoint is selected
        if (!learnsStore.isLoaded() && this.getAssignCt().getSelectedSparkpoint()) {
            learnsStore.load();
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
                    assignments[assignmentKey]
                    && assignments[assignmentKey] === flagId
                    && studentIdStrings.indexOf(assignmentKey) != -1
                ) {
                    studentDeletes.push({
                        sparkpoint: sparkpoint,
                        section: section,
                        'student_id': assignmentKey,
                        'resource_id': resourceId,
                        assignment: null
                    });
                }
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

    onMinimumChangeSection: function(field, value) {
        this.onMinimumChange(field, value);
    },

    onMinimumChange: function(field, value, record) {
        var me = this,
            section = me.getAppCt().getSelectedSection(),
            sparkpoint = me.getAssignCt().getSelectedSparkpoint();

        me.writeRequiredLearns({
            'student_id': record ? record.get('student').getId() : null,
            required: value === '' ? null : value,
            section: section,
            sparkpoint: sparkpoint
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
        if (data.table != 'learn_assignments_section' && data.table != 'learn_assignments_student') {
            return;
        }

        var me = this, // eslint-disable-line vars-on-top
            learnsStore = me.getAssignLearnsStore(),
            itemData = data.item,
            studentId = itemData.student_id,
            assignment = itemData.assignment || null,
            learn = learnsStore.getById(itemData.resource_id),
            assignments = {},
            popupHostColumn, popup, popupStudent,
            popupStore, popupStudentsCount, i = 0;

        if (
            !learn
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

            // update `section` assignment student-level store if open
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
        learn.set('assignments', Ext.applyIf(assignments, learn.get('assignments')));
    },


    // controller methods
    syncSelectedSparkpoint: function() {
        var me = this,
            appCt = me.getAppCt(),
            learnsCt = me.getLearnsCt(),
            studentSparkpoint = appCt && appCt.getSelectedStudentSparkpoint();

        if (!learnsCt || !learnsCt.hasParent()) {
            return;
        }

        if (studentSparkpoint) {
            if (studentSparkpoint.get('is_lesson')) {
                // switching to a lesson
                me.renderLessonLists(studentSparkpoint);
            } else {
                // switching to a regular sparkpoint
                learnsCt.removeAll();
                learnsCt.add([{
                    titleBar: null,
                    store: 'assign.Learns'
                }]);
            }

            learnsCt.show();
        } else {
            learnsCt.hide();
        }
    },

    renderLessonLists: function() {
        var me = this,
            learnsCt = me.getLearnsCt(),
            assignCt = me.getAssignCt(),
            learnLists = [],
            lesson = assignCt.getLesson(),
            groups, group, i;

        learnsCt.removeAll();

        groups = lesson && lesson.get('learn_groups') || [];

        for (i = 0; i < groups.length; i++) {
            group = groups[i];

            learnLists.push({
                title: group.title,
                emptyText: 'No Learns available for this group.',
                groupId: group.id,
                store: {
                    type: 'chained',
                    source: 'assign.Learns',
                    filters: [{
                        property: 'lesson_group_id',
                        value: group.id
                    }]
                }
            });
        }

        learnLists.push({
            title: 'Ungrouped',
            emptyText: 'No Learns available for this group.',
            groupId: null,
            store: {
                type: 'chained',
                source: 'assign.Learns',
                filters: [{
                    property: 'lesson_group_id',
                    value: null
                }]
            }
        });

        learnsCt.add(learnLists);
    },

    writeAssignments: function(assignmentsData) {
        Slate.API.request({
            method: 'POST',
            url: '/spark/api/assignments/learns',
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
    },

    writeRequiredLearns: function(learnData) {
        Slate.API.request({
            method: 'POST',
            url: '/spark/api/preferences/learns',
            jsonData: learnData,
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