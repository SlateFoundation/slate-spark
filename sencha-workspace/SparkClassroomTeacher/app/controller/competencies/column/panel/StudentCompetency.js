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
            rec = activityStore.getAt(activityStore.find('student_sparkpointid', this.getStudentCompetencyPopover().dataIndex));

        return rec;
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
                finished: !Ext.isEmpty(sparkData.learn_finish_time),
                overridden: !Ext.isEmpty(sparkData.learn_override_time),
                expected: 0,
                actual: 0
            }, {
                phase: 'Conference',
                status: 'Waiting',
                finished: !Ext.isEmpty(sparkData.conference_finish_time),
                overridden: !Ext.isEmpty(sparkData.conference_override_time),
                expected: 0,
                actual: 0
            }, {
                phase: 'Apply',
                status: 'Not Started',
                finished: !Ext.isEmpty(sparkData.apply_finish_time),
                overridden: !Ext.isEmpty(sparkData.apply_override_time),
                expected: 0,
                actual: 0
            }, {
                phase: 'Assess',
                status: 'Not Started',
                finished: !Ext.isEmpty(sparkData.assess_finish_time),
                overridden: !Ext.isEmpty(sparkData.assess_override_time),
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
            inputs = this.getPopoverTable().element.select('input.not-finished:enabled').elements;

        // Figure out which phases have been checked for override
        if(Ext.isArray(inputs)) {
            Ext.Array.each(inputs, function(el, i, arr) {
                var phaseName = Ext.get(el).parent().select('span.phase-name', true).elements[0].getHtml();
                var fieldName;

                switch(phaseName) {
                    case 'Learn':
                        fieldName = 'learn_override_time';
                        break;
                    case 'Conference':
                        fieldName = 'conference_override_time';
                        break;
                    case 'Apply':
                        fieldName = 'apply_override_time';
                        break;
                    case 'Assess':
                        fieldName = 'assess_override_time';
                        break;
                }

                // Prevent recording a new override time if it was already set.
                if(!Ext.isEmpty(record.get(fieldName)) && el.checked) {
                    return;
                }

                var value = el.checked ? new Date() : null;

                if(Ext.isEmpty(record.get(fieldName))) {
                    record.set(fieldName, value);
                }
            }, this);
        }

        record.set('override_reason', describeText);

        if(record.dirty) {
            record.save();
        }

        this.getStudentCompetencyPopover().hide();
    },

    addToQueue: function() {

    },

    addNextUp: function() {

    }
});