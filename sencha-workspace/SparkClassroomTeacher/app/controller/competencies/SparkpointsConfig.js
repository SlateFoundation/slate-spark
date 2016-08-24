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
            studentRec = studentStore.getById(studentId),
            studentData = studentRec.getData();

        me.getSparkpointsConfigWindow().setTitle(studentData.FullName);

        // TEMPORARY static data
        me.getConfigTableCurrent().updateData([
            {
                code: 'SCI.G5.LS1-1',
                L: 1,
                C: 2,
                Ap: 4,
                As: 5,
                completion: 6
            },
            {
                code: 'SCI.G9-12.ESS.1-2',
                L: 2,
                C: 3,
                Ap: 4,
                As: 5,
                completion: 6
            },
            {
                code: 'SS.G9-12.6.2.C.3.d',
                L: 3,
                C: 4,
                Ap: 5,
                As: 6,
                completion: 6
            }
        ]);

        me.getConfigTableQueue().updateData([
            {
                code: 'SCI.G5.LS1-1',
                L: 2,
                C: 3,
                Ap: 5,
                As: 6,
                completion: 6
            },
            {
                code: 'SCI.G9-12.ESS.1-2',
                L: 2,
                C: 3,
                Ap: 4,
                As: 5,
                completion: 5
            },
            {
                code: 'SS.G9-12.6.2.C.3.d',
                L: 3,
                C: 4,
                Ap: 5,
                As: 7,
                completion: 7
            }
        ]);
    },

    onDoneTap: function() {
        // 1. Save fields
        // 2. Update underlying grid (go back to StudentCompetency controller and add there as well)
        // 3. Hide SparkpointsConfigWindow
        this.getSparkpointsConfigWindow().hide();
    }
});
