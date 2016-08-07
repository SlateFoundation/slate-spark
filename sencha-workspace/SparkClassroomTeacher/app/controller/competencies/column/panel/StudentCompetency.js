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

        popoverTable: {
            updatedata: {
                fn: 'bindClickPopoverTable'
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

    getStudentSparkPoint: function() {
        var activityStore = Ext.getStore('Activities'),
            records = activityStore.getRange(),
            sparkParts = this.getStudentCompetencyPopover().dataIndex.split('_'),
            studentId = sparkParts[0],
            sparkpointId = sparkParts[1]

        //TODO: Fix this, hacky way to get record from this store, because the ID is not calculated properly.
        for(var i = 0; i < records.length; i++) {
            var rec = records[i];
            var data = rec.getData();

            if(data.student_id === parseInt(studentId) && data.sparkpoint_id === sparkpointId)
            {
                return rec;
            }
        }
    },

    loadDataIntoView: function() {
        var studentStore = Ext.getStore('Students'),
            sparkData = this.getStudentSparkPoint().getData(),
            studentId = sparkData.student_id,
            studentData = studentStore.findRecord('ID', studentId).getData();

        this.getPopoverTable().updateData({
            studentName: studentData.FullName,
            sparkpointCode: sparkData.sparkpoint,
            //TODO: calculate whether they receive class/desc for is-not-started is-on-pace is-behind is-ahead, possibly from API call?
            paceCls: 'is-not-started',
            paceDesc: 'Not Started Yet',
            phases: [{
                phase: 'Learn',
                status: '0/6',
                finished: !Ext.isEmpty(sparkData.learn_finish_time) || !Ext.isEmpty(sparkData.learn_override_time),
                expected: 0,
                actual: 0
            }, {
                phase: 'Conference',
                status: 'Waiting',
                finished: !Ext.isEmpty(sparkData.conference_finish_time) || !Ext.isEmpty(sparkData.conference_override_time),
                expected: 0,
                actual: 0
            }, {
                phase: 'Apply',
                status: 'Not Started',
                finished: !Ext.isEmpty(sparkData.apply_finish_time) || !Ext.isEmpty(sparkData.apply_override_time),
                expected: 0,
                actual: 0
            }, {
                phase: 'Assess',
                status: 'Not Started',
                finished: !Ext.isEmpty(sparkData.assess_finish_time) || !Ext.isEmpty(sparkData.assess_override_time),
                expected: 0,
                actual: 0
            }]
        });


        this.getDescribeTextArea().setLabel('Please explain how ' + studentData.FirstName + ' earned credit:');
    },

    bindClickPopoverTable: function(cmp) {
        var activeCheckboxes = Ext.get(cmp.el.select('input.not-finished', true));
        activeCheckboxes.on({
            'change': this.onPhaseCheckChange,
            'scope': this
        });
    },

    onPhaseCheckChange: function(e, target) {
        var el = Ext.get(target),
            checked = el.getValue() === "on",
            phaseName = el.parent().select('span.phase-name', true).elements[0].getHtml(),
            sparkData = this.getStudentSparkPoint().getData();

        // Action based on phase
        // TODO: Come back to this, no action to be taken currently. Note:
        // (maybe) Overriding a phase with previous phases uncompleted will override them too
        // So if above is true we need to set checked on previous phases, and not allow to be checked if a later phase is checked.
        switch(phaseName) {
            case 'Learn':
                break;
            case 'Conference':
                break;
            case 'Apply':
                break;
            case 'Assess':
                break;
        }
    },

    giveCredit: function() {
        var describeText = this.getDescribeTextArea().getValue(),
            record = this.getStudentSparkPoint(),
            checkedInputs = this.getPopoverTable().element.select('input.not-finished:checked');

        // For now just close the window if no inputs were checked.
        if(checkedInputs.length == 0) {
            this.getStudentCompetencyPopover().hide();
            return;
        }

        // Figure out which phases have been checked for override
        Ext.Array.each(checkedInputs, function(el, i, arr) {
            var phaseName = Ext.get(el.elements[0]).parent().select('span.phase-name', true).elements[0].getHtml();

            switch(phaseName) {
                case 'Learn':
                    record.set('learn_override_time', new Date());
                    break;
                case 'Conference':
                    record.set('conference_override_time', new Date());
                    break;
                case 'Apply':
                    record.set('apply_override_time', new Date());
                    break;
                case 'Assess':
                    record.set('assess_override_time', new Date());
                    break;
            }
        }, this);

        record.set('override_reason', describeText);
        record.commit();
        Ext.getStore('Activities').commitChanges();

        this.getStudentCompetencyPopover().hide();
    },

    addToQueue: function() {

    },

    addNextUp: function() {

    }
});