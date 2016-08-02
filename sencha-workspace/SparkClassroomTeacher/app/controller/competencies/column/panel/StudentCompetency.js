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

    views: [
        'competencies.column.panel.StudentCompetency'
    ],

    refs: {
        competenciesGrid: 'spark-competencies spark-competencies-grid',
        studentCompetencyPopover: 'spark-studentcompetency-popover'
    },

    control: {
        store: {
            "#Activities": {
                update: 'loadDataIntoView'
            }
        },

        studentCompetencyPopover: {
            initialize: {
                fn: 'onInitializePanel'
            }
        }
    },

    onInitializePanel: function() {
        //debugger;
        this.loadDataIntoView();
        this.bindActions();
    },

    loadDataIntoView: function() {
        var activityStore = Ext.getStore('Activities'),
            studentStore = Ext.getStore('Students'),
            sparkData = activityStore.findRecord('sparkpoint_id', this.dataIndex).getData(),
            studentData = studentStore.findRecord('ID', sparkData.student_id).getData();

        this.lookupReference('popoverTable').updateData({
            studentName: studentData.FullName,
            sparkpointCode: sparkData.sparkpoint,
            //TODO calculate whether they receive class/desc for is-not-started is-on-pace is-behind is-ahead, possibly from API call?
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

        this.lookupReference('popoverDescribe').setLabel('Please explain how ' + studentData.FirstName + ' earned credit:');
    },

    bindActions: function() {
        this.lookupReference('giveCreditBtn').on({
            'tap': this.giveCredit,
            'scope': this
        });

        this.lookupReference('addToQueueBtn').on({
            'tap': this.addToQueue,
            'scope': this
        });

        this.lookupReference('addNextUpBtn').on({
            'tap': this.addNextUp,
            'scope': this
        });


    },

    giveCredit: function() {

    },

    addToQueue: function() {

    },

    addNextUp: function() {

    }
});