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
        'Activities@SparkClassroom.store',
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

        configTableCurrent: 'spark-sparkpointsconfig-window component[cls*=sparkpointsconfig-table-current]',
        configTableQueue: 'spark-sparkpointsconfig-window component[cls*=sparkpointsconfig-table-queue]',
        doneButton: 'spark-sparkpointsconfig-window button[cls*=sparkpointsconfig-done-button]',
        sparkpointRows: 'spark-sparkpointsconfig-window tr[cls~=sparkpoint-row]'
    },

    // entry points
    listen: {
        controller: {
            '#': {
                activestudentidchange: 'initializeStudent'
            }
        }
    },

    control: {
        store: {
            '#Activities': {
                update: 'loadDataIntoView'
            }
        },

        doneButton: {
            tap: {
                fn: 'onDoneTap'
            }
        },

        configTableCurrent: {
            updatedata: {
                fn: 'onUpdateSparkRows'
            }
        },

        configTableQueue: {
            updatedata: {
                fn: 'onUpdateSparkRows'
            }
        },

        sparkpointsConfigWindow: {
            hide: {
                fn: 'onHideWindow'
            }
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
            studentStore = me.getStudentsStore(),
            studentId = me.getActiveStudentId(),
            activitesStore = me.getActivitiesStore(),
            studentRec = studentStore.getById(studentId),
            studentData = studentRec.getData(),
            currentSparkpoints, queuedSparkpoints,
            count,
            sparkpoint,
            assessDisabled, assessChecked, applyDisabled, applyChecked, confDisabled,
            confChecked, learnDisabled, learnChecked, allFinished,
            currentTableData = [],
            queuedTableData = [];

        currentSparkpoints = activitesStore.queryBy(function(rec) {
            return !Ext.isEmpty(rec.get('learn_start_time')) && rec.get('student_id') === studentData.ID;
        }).sort('last_accessed', 'DESC').getRange();

        queuedSparkpoints = activitesStore.queryBy(function(rec) {
            return Ext.isEmpty(rec.get('learn_start_time')) && rec.get('student_id') === studentData.ID;
        }).sort('last_accessed', 'DESC').getRange();

        me.getSparkpointsConfigWindow().setTitle(studentData.FullName);

        for (count = 0; count < currentSparkpoints.length; count++) {
            sparkpoint = currentSparkpoints[count];

            // Teachers can only disable an override if a student hasn't completed or had a later phase overridden
            assessDisabled = !Ext.isEmpty(sparkpoint.get('assess_finish_time'));
            assessChecked = assessDisabled || !Ext.isEmpty(sparkpoint.get('assess_override_time'));
            applyDisabled = assessDisabled || assessChecked || !Ext.isEmpty(sparkpoint.get('apply_finish_time'));
            applyChecked = applyDisabled || !Ext.isEmpty(sparkpoint.get('apply_override_time'));
            confDisabled = applyDisabled || applyChecked || !Ext.isEmpty(sparkpoint.get('conference_finish_time'));
            confChecked = confDisabled || !Ext.isEmpty(sparkpoint.get('conference_override_time'));
            learnDisabled = confDisabled || confChecked || !Ext.isEmpty(sparkpoint.get('learn_finish_time'));
            learnChecked = learnDisabled || !Ext.isEmpty(sparkpoint.get('learn_override_time'));
            allFinished = !Ext.isEmpty(sparkpoint.get('learn_finish_time')) && !Ext.isEmpty(sparkpoint.get('conference_finish_time')) && !Ext.isEmpty(sparkpoint.get('apply_finish_time')) && !Ext.isEmpty(sparkpoint.get('assess_finish_time'));

            currentTableData.push({
                'student_sparkpointid': sparkpoint.get('student_sparkpointid'),
                'sparkpoint': sparkpoint.get('sparkpoint'),
                'phases': [{
                    phase: 'Learn',
                    finished: !Ext.isEmpty(sparkpoint.get('learn_finish_time')),
                    disabled: learnDisabled,
                    checked: learnChecked,
                    expected: sparkpoint.get('learn_pace_target')
                }, {
                    phase: 'Conference',
                    finished: !Ext.isEmpty(sparkpoint.get('conference_finish_time')),
                    disabled: confDisabled,
                    checked: confChecked,
                    expected: sparkpoint.get('conference_pace_target')
                }, {
                    phase: 'Apply',
                    finished: !Ext.isEmpty(sparkpoint.get('apply_finish_time')),
                    disabled: applyDisabled,
                    checked: applyChecked,
                    expected: sparkpoint.get('apply_pace_target')
                }, {
                    phase: 'Assess',
                    finished: !Ext.isEmpty(sparkpoint.get('assess_finish_time')),
                    disabled: assessDisabled,
                    checked: assessChecked,
                    expected: sparkpoint.get('assess_pace_target')
                }]
            });
        }

        for (count = 0; count < queuedSparkpoints.length; count++) {
            sparkpoint = queuedSparkpoints[count];

            currentTableData.push({
                'student_sparkpointid': sparkpoint.get('student_sparkpointid'),
                'sparkpoint': sparkpoint.get('sparkpoint'),
                'phases': [{
                    phase: 'Learn',
                    finished: !Ext.isEmpty(sparkpoint.get('learn_finish_time')),
                    disabled: learnDisabled,
                    checked: learnChecked,
                    expected: sparkpoint.get('learn_pace_target')
                }, {
                    phase: 'Conference',
                    finished: !Ext.isEmpty(sparkpoint.get('conference_finish_time')),
                    disabled: confDisabled,
                    checked: confChecked,
                    expected: sparkpoint.get('conference_pace_target')
                }, {
                    phase: 'Apply',
                    finished: !Ext.isEmpty(sparkpoint.get('apply_finish_time')),
                    disabled: applyDisabled,
                    checked: applyChecked,
                    expected: sparkpoint.get('apply_pace_target')
                }, {
                    phase: 'Assess',
                    finished: !Ext.isEmpty(sparkpoint.get('assess_finish_time')),
                    disabled: assessDisabled,
                    checked: assessChecked,
                    expected: sparkpoint.get('assess_pace_target')
                }]
            });
        }

        if (currentTableData.length == 0) {
            me.getConfigTableCurrent().hide();
        } else {
            me.getConfigTableCurrent().updateData(currentTableData);
            me.getConfigTableCurrent().show();
        }

        if (queuedTableData.length == 0) {
            me.getConfigTableQueue().hide();
        } else {
            me.getConfigTableQueue().updateData(queuedTableData);
            me.getConfigTableQueue().show();
        }

        me.bindPaceFields();
    },

    bindPaceFields: function() {
        var me = this,
            paceFields = me.getSparkpointsConfigWindow().element.select('input.pace-field').elements,
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

    onPaceFieldChange: function(e, el) {
        var activitiesStore = this.getActivitiesStore(),
            paceField = Ext.get(el),
            paceFieldVal = paceField.getValue(),
            phase = paceField.getAttribute('data-phase'),
            studentSparkpointId = paceField.up('tr.sparkpoint-row').getAttribute('data-student-sparkpointid'),
            sparkpoint = activitiesStore.findRecord('student_sparkpointid', studentSparkpointId),
            prevCell = paceField.up('td').prev('td'),
            nextCell = paceField.up('td').next('td'),
            prevInput,
            nextInput;

        if (!Ext.isEmpty(prevCell)) {
            prevInput = prevCell.down('input.pace-field');

            // Prevent setting future phase pace before previous phase
            if (prevInput && parseInt(paceFieldVal, 10) <= parseInt(prevInput.getValue(), 10)) {
                Ext.Msg.alert('Invalid Target Pace', 'The ' + paceField.getAttribute('data-phase') + ' must be done after the ' + prevInput.getAttribute('data-phase') + ' phase. Please enter a completion day that is after the ' + prevInput.getAttribute('data-phase') + ' phase.', function() {
                    paceField.focus(50);
                });

                paceField.dom.value = parseInt(prevInput.getValue(), 10) + 1;
            }
        }

        if (!Ext.isEmpty(nextCell)) {
            nextInput = nextCell.down('input.pace-field');

            // Prevent setting previous phase pace before next phase
            if (nextInput && parseInt(paceFieldVal, 10) >= parseInt(nextInput.getValue(), 10)) {
                Ext.Msg.alert('Invalid Target Pace', 'The ' + paceField.getAttribute('data-phase') + ' must be done before the ' + nextInput.getAttribute('data-phase') + ' phase. Please enter a completion day that is before the ' + nextInput.getAttribute('data-phase') + ' phase.', function() {
                    paceField.focus(50);
                });

                paceField.dom.value = parseInt(nextInput.getValue(), 10) - 1;
            }
        }

        sparkpoint.set(phase.toLowerCase() + '_pace_target', paceField.getValue());
    },

    onHideWindow: function() {
        var activityStore = this.getActivitiesStore();

        activityStore.rejectChanges();
    },

    onDoneTap: function() {
        var me = this,
            activityStore = me.getActivitiesStore(),
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
            sparkpoint = activityStore.findRecord('student_sparkpointid', studentSparkpointId);

            if (sparkpoint.dirty) {
                sparkpoint.save();
            }
        }

        me.getSparkpointsConfigWindow().hide();
    },

    onUpdateSparkRows: function(component) {
        var me = this,
            overrideFields = component.element.select('.override-field'),
            overrideField,
            count;

        for (count = 0; count < overrideFields.elements.length; count++) {
            overrideField = Ext.get(overrideFields.elements[count]);

            overrideField.on('change', function(e, target) {
                me.onOverrideChange(e, target);
            });
        }
    },

    onOverrideChange: function(e, target) {
        var me = this,
            activityStore = me.getActivitiesStore(),
            el = Ext.get(target),
            checked = el.is(':checked'),
            phaseName = el.getAttribute('data-phase'),
            studentSparkpointId = el.up('tr.sparkpoint-row').getAttribute('data-student-sparkpointid'),
            record = activityStore.findRecord('student_sparkpointid', studentSparkpointId),
            chainCheckbox,
            value;

        switch (phaseName) {
            case 'Learn':
                break;
            case 'Conference':
                chainCheckbox = el.up('.sparkpoint-row').down('input.override-field[data-phase="Learn"]');
                break;
            case 'Apply':
                chainCheckbox = el.up('.sparkpoint-row').down('input.override-field[data-phase="Conference"]');
                break;
            case 'Assess':
                chainCheckbox = el.up('.sparkpoint-row').down('input.override-field[data-phase="Apply"]');
                break;
            default:
        }

        // If we checked a later phase, ensure that the previous phases are also checked
        if (!Ext.isEmpty(chainCheckbox) && !chainCheckbox.hasCls('finished')) {
            if (!chainCheckbox.is(':disabled')) {
                chainCheckbox.dom.disabled = true;
            }

            if (!chainCheckbox.is(':checked')) {
                chainCheckbox.dom.checked = true;
            }

            me.onOverrideChange(null, chainCheckbox);
        }

        // If we unchecked this then remove disabled state if the prev phase wasn't finished
        if (!Ext.isEmpty(chainCheckbox) && !checked) {
            if (!chainCheckbox.hasCls('finished')) {
                chainCheckbox.dom.removeAttribute('disabled');
            }
        }

        value = checked ? new Date() : null;

        record.set(phaseName.toLowerCase() + '_override_time', value);
    }
});
