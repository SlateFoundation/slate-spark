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
        doneButton: 'spark-sparkpointsconfig-window button[cls*=sparkpointsconfig-done-button]'
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
                code: sparkpoint.get('sparkpoint'),
                C: '',
                Ap: '',
                As: '',
                completion: ''
            });
        }

        for (count = 0; count < queuedSparkpoints.length; count++) {
            sparkpoint = queuedSparkpoints[count];

            currentTableData.push({
                code: sparkpoint.get('sparkpoint'),
                C: '',
                Ap: '',
                As: '',
                completion: ''
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
    },

    onDoneTap: function() {
        // 1. Save fields
        // 2. Update underlying grid (go back to StudentCompetency controller and add there as well)
        // 3. Hide SparkpointsConfigWindow
        this.getSparkpointsConfigWindow().hide();
    }
});
