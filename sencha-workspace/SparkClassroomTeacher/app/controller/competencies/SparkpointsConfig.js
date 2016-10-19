/* global SparkClassroom Slate */
/**
 * Manages the window for configuring Sparkpoints for a specific student.
 *
 * ## Responsibilities
 * - Allows overriding student sparkpoint finish times
 * - Highlights the active sparkpoint & current sparkpoints
 * - Allows saving pacing information (text & number of days)
 */
Ext.define('SparkClassroomTeacher.controller.competencies.SparkpointsConfig', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkClassroom.timing.DurationDisplay'
    ],

    config: {

        /**
         * @private
         * Handle for the student in focus
         */
        activeStudentId: null
    },

    views: [
        'competencies.SparkpointsConfigWindow'
    ],

    stores: [
        'CompetencySparkpoints@SparkClassroomTeacher.store',
        'Students@SparkClassroom.store',
        'work.Learns@SparkClassroom.store'
    ],

    refs: {
        competenciesGrid: 'spark-competencies spark-competencies-grid',

        sparkpointsConfigWindow: {
            selector: 'spark-sparkpointsconfig-window',
            xtype: 'spark-sparkpointsconfig-window',
            autoCreate: true
        },

        sparkpointField: 'spark-sparkpointsconfig-window spark-sparkpointfield',
        configTableActive: 'spark-sparkpointsconfig-window component[cls*=sparkpointsconfig-table active]',
        configTableCurrent: 'spark-sparkpointsconfig-window component[cls*=sparkpointsconfig-table current]',
        configTableQueue: 'spark-sparkpointsconfig-window component[cls*=sparkpointsconfig-table queue]',
        doneButton: 'spark-sparkpointsconfig-window button[cls*=sparkpointsconfig-done-button]',
        sparkpointRows: 'spark-sparkpointsconfig-window tr[cls~=sparkpoint-row]'
    },

    // entry points
    listen: {
        controller: {
            '#': {
                activestudentidchange: 'initializeStudent'
            }
        },
    },

    control: {
        doneButton: {
            tap: {
                fn: 'onDoneTap'
            }
        },

        sparkpointsConfigWindow: {
            beforehide: {
                fn: 'onBeforeHideWindow'
            }
        },

        sparkpointField: {
            sparkpointselect: 'suggestNextSparkpoint'
        }
    },

    initializeStudent: function(studentId) {
        var me = this;

        me.setActiveStudentId(studentId);
        me.loadDataIntoView();
        me.getSparkpointsConfigWindow().show();
    },

    loadDataIntoView: function() {
        var me = this,
            sparkpointField,
            studentStore = me.getStudentsStore(),
            studentId = me.getActiveStudentId(),
            competencySparkpointsStore = me.getCompetencySparkpointsStore(),
            studentRec = studentStore.getById(studentId),
            studentData = studentRec.getData(),
            activeSparkpoints, queuedSparkpoints,
            count,
            sparkpoint,
            assessDisabled, assessChecked, applyDisabled, applyChecked, confDisabled,
            confChecked, learnDisabled, learnChecked,
            activeTableData = [],
            queuedTableData = [],
            currentTableData = [],
            lastAccessedIndex = 0;

        activeSparkpoints = competencySparkpointsStore.queryBy(function(rec) {
            // get sparkpoints that belong to this student that have been started but haven't been completed
            return rec.get('student_id') === studentData.ID
                    && !Ext.isEmpty(rec.get('learn_start_time'))
                    && Ext.isEmpty(rec.get('assess_completed_time'));
        }).sort('recommended_time', 'ASC').getRange();

        queuedSparkpoints = competencySparkpointsStore.queryBy(function(rec) {
            // get sparkpoints that belong to this student that have been recommended but not started nor completed (assess phase overriden)
            return rec.get('student_id') === studentData.ID
                    && Ext.isEmpty(rec.get('learn_start_time'))
                    && !Ext.isEmpty(rec.get('recommended_time'))
                    && Ext.isEmpty(rec.get('assess_completed_time'));
        }).sort('recommended_time', 'ASC').getRange();

        me.getSparkpointsConfigWindow().setTitle(studentData.FullName);

        for (count = 0; count < activeSparkpoints.length; count++) {
            sparkpoint = activeSparkpoints[count];

            if (sparkpoint.get('last_accessed') > activeSparkpoints[lastAccessedIndex].get('last_accessed')) {
                lastAccessedIndex = count;
            }

            // Teachers can only disable an override if a student hasn't completed or had a later phase overridden
            assessDisabled = !Ext.isEmpty(sparkpoint.get('assess_finish_time'));
            assessChecked = assessDisabled || !Ext.isEmpty(sparkpoint.get('assess_override_time'));
            applyDisabled = assessDisabled || assessChecked || !Ext.isEmpty(sparkpoint.get('apply_finish_time'));
            applyChecked = applyDisabled || !Ext.isEmpty(sparkpoint.get('apply_override_time'));
            confDisabled = applyDisabled || applyChecked || !Ext.isEmpty(sparkpoint.get('conference_finish_time'));
            confChecked = confDisabled || !Ext.isEmpty(sparkpoint.get('conference_override_time'));
            learnDisabled = confDisabled || confChecked || !Ext.isEmpty(sparkpoint.get('learn_finish_time'));
            learnChecked = learnDisabled || !Ext.isEmpty(sparkpoint.get('learn_override_time'));

            activeTableData.push({
                'student_sparkpointid': sparkpoint.get('student_sparkpointid'),
                'sparkpoint': sparkpoint.get('sparkpoint'),
                'phases': [{
                    phase: 'Learn',
                    finished: !Ext.isEmpty(sparkpoint.get('learn_finish_time')),
                    disabled: learnDisabled,
                    checked: learnChecked,
                    expected: sparkpoint.get('learn_pace_target'),
                    actual: me.getPhaseDuration(
                        sparkpoint.get('section'),
                        sparkpoint.get('learn_start_time'),
                        sparkpoint.get('learn_completed_time')
                    )
                }, {
                    phase: 'Conference',
                    finished: !Ext.isEmpty(sparkpoint.get('conference_finish_time')),
                    disabled: confDisabled,
                    checked: confChecked,
                    expected: sparkpoint.get('conference_pace_target'),
                    actual: me.getPhaseDuration(
                        sparkpoint.get('section'),
                        sparkpoint.get('learn_start_time'),
                        sparkpoint.get('conference_completed_time')
                    )
                }, {
                    phase: 'Apply',
                    finished: !Ext.isEmpty(sparkpoint.get('apply_finish_time')),
                    disabled: applyDisabled,
                    checked: applyChecked,
                    expected: sparkpoint.get('apply_pace_target'),
                    actual: me.getPhaseDuration(
                        sparkpoint.get('section'),
                        sparkpoint.get('learn_start_time'),
                        sparkpoint.get('apply_completed_time')
                    )
                }, {
                    phase: 'Assess',
                    finished: !Ext.isEmpty(sparkpoint.get('assess_finish_time')),
                    disabled: assessDisabled,
                    checked: assessChecked,
                    expected: sparkpoint.get('assess_pace_target'),
                    actual: me.getPhaseDuration(
                        sparkpoint.get('section'),
                        sparkpoint.get('learn_start_time'),
                        sparkpoint.get('assess_completed_time')
                    )
                }]
            });
        }

        // move last accessed sparkpoint to current table data
        currentTableData.push(activeTableData.splice(lastAccessedIndex, 1)[0]);

        for (count = 0; count < queuedSparkpoints.length; count++) {
            sparkpoint = queuedSparkpoints[count];

            queuedTableData.push({
                'student_sparkpointid': sparkpoint.get('student_sparkpointid'),
                'sparkpoint': sparkpoint.get('sparkpoint'),
                'phases': [{
                    phase: 'Learn',
                    expected: sparkpoint.get('learn_pace_target')
                }, {
                    phase: 'Conference',
                    expected: sparkpoint.get('conference_pace_target')
                }, {
                    phase: 'Apply',
                    expected: sparkpoint.get('apply_pace_target')
                }, {
                    phase: 'Assess',
                    expected: sparkpoint.get('assess_pace_target')
                }]
            });
        }

        if (currentTableData.length === 0) {
            me.getConfigTableCurrent().hide();
        } else {
            me.getConfigTableCurrent().updateData(currentTableData);
            me.getConfigTableCurrent().show();
        }

        if (activeTableData.length === 0) {
            me.getConfigTableActive().hide();
        } else {
            me.getConfigTableActive().updateData(activeTableData);
            me.getConfigTableActive().show();
        }

        if (queuedTableData.length === 0) {
            me.getConfigTableQueue().hide();
        } else {
            me.getConfigTableQueue().updateData(queuedTableData);
            me.getConfigTableQueue().show();
        }

        sparkpointField = me.getSparkpointField(); // Declared now since it will have rendered

        me.bindPaceFields();
        me.bindReordering();
        me.bindRemoveBtns();

        sparkpointField.filterFn = function(rec) { // Note - setter wasn't working
            // only show sparkpoints that are not already associated with this student
            return Ext.getStore('CompetencySparkpoints').find('student_sparkpointid', rec.data.student_sparkpointid) === -1;
        };

        sparkpointField.updateSelectedStudent(studentId);
        sparkpointField.getSuggestionsList().setWidth(500);
    },

    getPhaseDuration: function(sectionCode, startDate, endDate) {
        if (Ext.isEmpty(sectionCode)) {
            sectionCode = this.getAppCt().getSelectedSection();
        }

        if (Ext.isEmpty(startDate) || Ext.isEmpty(endDate)) {
            return null;
        }

        return SparkClassroom.timing.DurationDisplay.calculateDuration(sectionCode, startDate, endDate, true, true);
    },

    bindPaceFields: function() {
        var me = this,
            paceFields = me.getSparkpointsConfigWindow().element.select('input.expected-completion').elements,
            paceField,
            count;

        for (count = 0; count < paceFields.length; count++) {
            paceField = Ext.get(paceFields[count]);
            paceField.on('change', function(e, el) {
                me.onPaceFieldChange(e, el);
            });

            // Bind on blur as well to detect user interaction incase they want to explicity set a default.
            paceField.on('blur', function(e, el) {
                me.onPaceFieldChange(e, el);
            });
        }
    },

    bindReordering: function() {
        var me = this,
            sortArrows = me.getSparkpointsConfigWindow().element.select('.row-reorder-buttons i').elements,
            arrow,
            count;

        for (count = 0; count < sortArrows.length; count++) {
            arrow = Ext.get(sortArrows[count]);
            arrow.on('click', function(e, el) {
                me.onSortArrowClick(e, el);
            });
        }
    },

    bindRemoveBtns: function() {
        var me = this,
            removeBtns = me.getSparkpointsConfigWindow().element.select('.remove-cell button[action="row-remove"]').elements,
            removeBtn,
            count;

        for (count = 0; count < removeBtns.length; count++) {
            removeBtn = Ext.get(removeBtns[count]);

            removeBtn.on('click', function(e, el) {
                me.onRemoveSparkpoint(e, el);
            });
        }
    },

    /*
    Ensure that subsequent phase pace values are greater than previous phase and set sparkpoint with new values
    */
    onPaceFieldChange: function(e, el) {
        var me = this,
            competencySparkpointsStore = me.getCompetencySparkpointsStore(),
            changedPaceField = Ext.get(el),
            newPaceValue = changedPaceField.getValue(),
            changedPhase = changedPaceField.getAttribute('data-phase'),
            sparkRow = changedPaceField.up('tr.sparkpoint-row'),
            studentSparkpointId = sparkRow.getAttribute('data-student-sparkpointid'),
            sparkpoint = competencySparkpointsStore.findRecord('student_sparkpointid', studentSparkpointId),
            paceFields = sparkRow.select('input.expected-completion').elements,
            oldPaceValue = sparkpoint.get(changedPhase.toLowerCase() + '_pace_target'),
            count, fieldEl, fieldVal, nextFieldEl, nextFieldVal;

        // convert to integer, if input is blank, replace with 1
        newPaceValue = newPaceValue === '' ? 1 : parseInt(newPaceValue, 10);

        if (newPaceValue === oldPaceValue) {
            return;
        }

        sparkpoint.set(changedPhase.toLowerCase() + '_pace_target', newPaceValue);

        for (count = 0; count + 1 < paceFields.length; count++) {
            fieldEl = Ext.fly(paceFields[count]);
            fieldVal = parseInt(fieldEl.getValue(), 10);
            nextFieldEl = Ext.fly(paceFields[count + 1]);
            nextFieldVal = parseInt(nextFieldEl.getValue(), 10);

            if (!Ext.isNumber(fieldVal)) {
                fieldEl.dom.value = 1;
            }

            if (fieldVal > nextFieldVal || !Ext.isNumber(nextFieldVal)) {
                nextFieldEl.dom.value = fieldVal;

                sparkpoint.set(nextFieldEl.getAttribute('data-phase').toLowerCase() + '_pace_target', fieldVal);
            }
        }

        me.getSparkpointsConfigWindow().setDirty(true);
    },

    onSortArrowClick: function(e, el) {
        var me = this,
            competencySparkpointsStore = me.getCompetencySparkpointsStore(),
            arrow = Ext.get(el),
            sparkRow = arrow.up('tr.sparkpoint-row'),
            siblingSparkRows = sparkRow.up('.sparkpointsconfig-table').query('.sparkpoint-row'),
            studentSparkpointId = sparkRow.getAttribute('data-student-sparkpointid'),
            sparkpoint = competencySparkpointsStore.findRecord('student_sparkpointid', studentSparkpointId),
            neighborSparkpoint,
            sortDirection,
            sortableSparkpoint,
            count,
            minutes;

        if (arrow.hasCls('fa-arrow-down')) {
            neighborSparkpoint = competencySparkpointsStore.findRecord('student_sparkpointid', sparkRow.next('tr.sparkpoint-row').getAttribute('data-student-sparkpointid'));
            sortDirection = 'down';

        } else {
            neighborSparkpoint = competencySparkpointsStore.findRecord('student_sparkpointid', sparkRow.prev('tr.sparkpoint-row').getAttribute('data-student-sparkpointid'));
            sortDirection = 'up';
        }

        // loop through all sparkpoints in this table and set recommended_time to now + index,
        // change the index either up or down for sparkpoint/neighborsparkpoint so they switch positions appropriately
        for (count = 0; count < siblingSparkRows.length; count++) {
            sortableSparkpoint = competencySparkpointsStore.findRecord('student_sparkpointid', siblingSparkRows[count].getAttribute('data-student-sparkpointid'));
            minutes = count;

            if (sortableSparkpoint === sparkpoint) {
                minutes = sortDirection === 'down' ? minutes + 1 : minutes - 1;
            } else if (sortableSparkpoint === neighborSparkpoint) {
               minutes = sortDirection === 'down' ? minutes - 1 : minutes + 1;
            }

            sortableSparkpoint.set('recommended_time', Ext.Date.add(new Date(), Ext.Date.MINUTE, minutes));
            me.getSparkpointsConfigWindow().setDirty(true);
        }

        me.loadDataIntoView();
    },

    onRemoveSparkpoint: function(e, el) {
        var me = this,
            competencySparkpointsStore = me.getCompetencySparkpointsStore(),
            sparkRow = Ext.get(el).up('tr.sparkpoint-row'),
            studentSparkpointId = sparkRow.getAttribute('data-student-sparkpointid'),
            sparkpoint = competencySparkpointsStore.findRecord('student_sparkpointid', studentSparkpointId);

        if (Ext.isEmpty(sparkpoint)) {
            return;
        }

        sparkpoint.getProxy().setExtraParams({
            'student_id': sparkpoint.get('student_id'),
            'section_id': sparkpoint.get('section_id'),
            'sparkpoint': sparkpoint.get('sparkpoint')
        });

        sparkpoint.erase({
            failure: function(rec, op) {
                var error = op && op.error && op.error.statusText;

                Ext.Msg.alert('Error', 'Unable to remove this sparkpoint. (' + error + ')');
            },
            success: function() {
                this.loadDataIntoView();
            },
            scope: me
        });
    },

    onBeforeHideWindow: function(sparkpointsConfigWindow) {
        var me = this;

        if (sparkpointsConfigWindow.getDirty()) {
            Ext.Msg.confirm('Unsaved Changes', 'Your changes will be lost if you continue. Do you still wish to continue?',
                function (choice) {
                    if (choice === 'yes') {
                        me.getCompetencySparkpointsStore().rejectChanges();
                        sparkpointsConfigWindow.setDirty(false);
                        sparkpointsConfigWindow.hide();
                    }
                }
            );

            return false;
        }

        return true;
    },

    onDoneTap: function() {
        var me = this,
            competencySparkpointsStore = me.getCompetencySparkpointsStore(),
            // DomQuery usage due to the fact refs do not allow multiple selections
            sparkpointRows = Ext.query('.spark-sparkpointsconfig-window tr.sparkpoint-row'),
            rowElement,
            row,
            studentSparkpointId,
            sparkpoint;

        // Save dirty sparkpoints as records may be changed earlier
        for (row = 0; row < sparkpointRows.length; row++) {
            rowElement = Ext.fly(sparkpointRows[row]);
            studentSparkpointId = rowElement.getAttribute('data-student-sparkpointid');
            sparkpoint = competencySparkpointsStore.findRecord('student_sparkpointid', studentSparkpointId);

            if (sparkpoint && sparkpoint.dirty) {
                sparkpoint.save();
            }
        }

        competencySparkpointsStore.commitChanges();
        me.getSparkpointsConfigWindow().setDirty(false);
        me.getSparkpointsConfigWindow().hide();
    },

    suggestNextSparkpoint: function() {
        var me = this,
            studentId = me.getActiveStudentId(),
            sparkpointField = me.getSparkpointField(),
            recommendedSparkpoint = sparkpointField.getSelectedSparkpoint();

        if (!recommendedSparkpoint) {
            return;
        }

        Slate.API.request({
            method: 'PATCH',
            url: '/spark/api/work/activity',
            jsonData: {
                'sparkpoint': recommendedSparkpoint.getId(),
                'student_id': studentId
            },
            callback: function(options, success) {
                if (!success) {
                    Ext.Msg.alert('Failed to recommend sparkpoint', 'This sparkpoint could not be added to the student\'s recommended sparkpoints, please try again or contact an administrator');
                    return;
                }

                me.loadDataIntoView();

                sparkpointField.setSelectedSparkpoint(null);
                sparkpointField.setQuery(null);
            }
        });
    }
});
