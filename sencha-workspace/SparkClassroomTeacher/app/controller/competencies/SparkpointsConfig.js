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

    control: {
        store: {
            "#Activities": {
                update: 'loadDataIntoView'
            }
        },

        sparkpointsConfigWindow: {
            loadnewstudent: {
                fn: 'onInitializeStudent'
            }
        },

        doneButton: {
            tap: {
                fn: 'onDoneTap'
            }
        }
    },
    onInitializeStudent: function(studentUsername) {
        this.loadDataIntoView(studentUsername);
        this.getSparkpointsConfigWindow().show();
    },

    loadDataIntoView: function(studentUsername) {
        var studentStore = this.getStudentsStore(),
            studentRec = studentStore.findRecord("Username", studentUsername),
            studentData = studentRec.getData();

        this.getSparkpointsConfigWindow().setTitle(studentData.FullName);

        // TEMPORARY
        this.getConfigTableCurrent().updateData([
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

        this.getConfigTableQueue().updateData([
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
