/**
 * Manages the floating panel that displays when you click on a spark point in the Sparkpoint Overview.
 *
 * ## Responsibilities
 * - Allow teacher to override and provide a reason.
 * - Write override times to the store
 */
Ext.define('SparkClassroomTeacher.controller.competencies.column.panel.StudentCompetency', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.MessageBox',
        'Slate.API'
    ],

    stores: [
        'Activities@SparkClassroom.store',
        'Students@SparkClassroom.store'
    ],

    refs: {
        competenciesGrid: 'spark-competencies spark-competencies-grid',
        studentCompetencyPopover: 'spark-studentcompetency-popover',
        popoverTable: 'spark-studentcompetency-popover component[cls=studentcompetency-popover-table]',
        addToQueueButton: 'spark-studentcompetency-popover button[cls=add-to-queue-button]',
        addNextUpButton: 'spark-studentcompetency-popover button[cls=add-next-up-button]',
        giveCreditButton: 'spark-studentcompetency-popover button[cls=give-credit-button]',
        describeTextArea: 'spark-studentcompetency-popover textareafield[cls~=popover-describe-field]'
    },

    control: {
        store: {
            "#Activities": {
                update: 'loadDataIntoView'
            }
        },

        studentCompetencyPopover: {
            show: {
                fn: 'onInitializePanel'
            }
        },

        addToQueueButton: {
            tap: {
                fn: 'addToQueue'
            }
        },

        addNextUpButton: {
            tap: {
                fn: 'addNextUp'
            }
        },

        giveCreditButton: {
            tap: {
                fn: 'giveCredit'
            }
        }
    },

    onInitializePanel: function() {
        this.loadDataIntoView();
    },

    loadDataIntoView: function() {
        var activityStore = Ext.getStore('Activities'),
            studentStore = Ext.getStore('Students'),
            sparkData,
            studentData,
            records = activityStore.getRange(),
            sparkParts = this.getStudentCompetencyPopover().dataIndex.split('_'),
            studentId = sparkParts[0],
            sparkpointId = sparkParts[1],
            studentData = studentStore.findRecord('ID', studentId).getData();

        //TODO: Fix this, hacky way to get record from this store, because the ID is not calculated properly.
        for(var i = 0; i < records.length; i++) {
            var data = records[i].getData();
            if(data.student_id === parseInt(studentId) && data.sparkpoint_id === sparkpointId)
            {
                sparkData = data;
            }
        }

        this.getPopoverTable().updateData({
            studentName: studentData.FullName,
            sparkpointCode: sparkData.sparkpoint,
            //TODO: calculate whether they receive class/desc for is-not-started is-on-pace is-behind is-ahead, possibly from API call?
            paceCls: 'is-not-started',
            paceDesc: 'Not Started Yet',
            phases: [{
                phase: 'Learn',
                status: '0/6',
                expected: 1,
                actual: 1
            }, {
                phase: 'Conference',
                status: 'Waiting',
                expected: 2,
                actual: 3
            }, {
                phase: 'Apply',
                status: 'Not Started',
                expected: 4,
                actual: 3
            }, {
                phase: 'Assess',
                status: 'Not Started',
                expected: 5
            }]
        });

        this.getDescribeTextArea().setLabel('Please explain how ' + studentData.FirstName + ' earned credit:');
    },

    giveCredit: function() {

    },

    addToQueue: function() {

    },

    addNextUp: function() {

    }
});