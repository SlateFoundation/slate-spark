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

            currentTableData.push({
                'student_sparkpointid': sparkpoint.get('student_sparkpointid'),
                code: sparkpoint.get('sparkpoint'),
                L: sparkpoint.get('learn_pace_target'),
                C: sparkpoint.get('conference_pace_target'),
                Ap: sparkpoint.get('apply_pace_target'),
                As: sparkpoint.get('assess_pace_target')
            });
        }

        for (count = 0; count < queuedSparkpoints.length; count++) {
            sparkpoint = queuedSparkpoints[count];

            currentTableData.push({
                'student_sparkpointid': sparkpoint.get('student_sparkpointid'),
                code: sparkpoint.get('sparkpoint'),
                L: sparkpoint.get('learn_pace_target'),
                C: sparkpoint.get('conference_pace_target'),
                Ap: sparkpoint.get('apply_pace_target'),
                As: sparkpoint.get('assess_pace_target')
            })
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

        // TODO: Bind event handlers to the pace inputs to prevent entering non-integer values
    },

    onDoneTap: function() {
        // 1. Save fields
        var me = this,
            activityStore = me.getActivitiesStore(),
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

        for(row = 0; row < sparkpointRows.length; row++) {
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
    }
});
