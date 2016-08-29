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
    },

    onDoneTap: function() {
        var me = this,
            activityStore = me.getActivitiesStore(),
            // DomQuery usage due to the fact refs do not allow multiple selections
            sparkpointRows = Ext.DomQuery.select('.spark-sparkpointsconfig-window tr.sparkpoint-row'),
            rowElement,
            paceFields,
            row,
            field,
            paceField,
            phase,
            studentSparkpointId,
            sparkpoint,
            paceValue;

        for (row = 0; row < sparkpointRows.length; row++) {
            rowElement = Ext.fly(sparkpointRows[row]);
            paceFields = rowElement.query('input.pace-field', true);
            studentSparkpointId = rowElement.getAttribute('data-student-sparkpointid');
            sparkpoint = activityStore.findRecord('student_sparkpointid', studentSparkpointId);

            for (field = 0; field < paceFields.length; field++) {
                paceField = Ext.fly(paceFields[field]);
                phase = paceField.getAttribute('data-phase');
                paceValue = paceField.getValue();

                switch (phase) {
                    case 'Learn':
                        sparkpoint.set('learn_pace_target', paceValue);
                        break;
                    case 'Conference':
                        sparkpoint.set('conference_pace_target', paceValue);
                        break;
                    case 'Apply':
                        sparkpoint.set('apply_pace_target', paceValue);
                        break;
                    case 'Assess':
                        sparkpoint.set('assess_pace_target', paceValue);
                        break;
                    default:
                }
            }

            if (sparkpoint.dirty) {
                sparkpoint.save();
            }
        }

        // 2. Update underlying grid (go back to StudentCompetency controller and add there as well)
        // 3. Hide SparkpointsConfigWindow
        me.getSparkpointsConfigWindow().hide();
    },

    onUpdateSparkRows: function(component) {
        var me = this,
            overrideFields = Ext.select('component[cls*=' + component.getConfig('cls')[0] + '] input.override-checkbox'),
            overrideField,
            count;

        for (count = 0; count < overrideFields.elements.length; count++) {
            overrideField = Ext.fly(overrideFields[count]);

            overrideField.on('change', me.onOverrideChange);
        }
    },

    onOverrideChange: function(e, target) {
        var me = this,
            el = Ext.get(target),
            checked = el.is(':checked'),
            phaseName = el.getAttribute('data-phase'),
            record = me.getStudentSparkpoint(),
            chainCheckbox,
            fieldName,
            value;

        switch (phaseName) {
            case 'Learn':
                fieldName = 'learn_override_time';
                break;
            case 'Conference':
                fieldName = 'conference_override_time';
                chainCheckbox = me.getLearnCheckbox();
                break;
            case 'Apply':
                fieldName = 'apply_override_time';
                chainCheckbox = me.getConferenceCheckbox();
                break;
            case 'Assess':
                fieldName = 'assess_override_time';
                chainCheckbox = me.getApplyCheckbox();
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

            me.onPhaseCheckChange(null, chainCheckbox);
        }

        // If we unchecked this then remove disabled state if the prev phase wasn't finished
        if (!Ext.isEmpty(chainCheckbox) && !checked) {
            if (!chainCheckbox.hasCls('finished')) {
                chainCheckbox.dom.removeAttribute('disabled');
            }
        }

        value = checked ? new Date() : null;

        record.set(fieldName, value);
    }
});
