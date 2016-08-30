/**
 * Manages the floating panel that displays when you click on a spark point in the Sparkpoint Overview.
 *
 * ## Responsibilities
 * - Allow teacher to override and provide a reason.
 * - Write override times to the store
 */
Ext.define('SparkClassroomTeacher.controller.competencies.StudentCompetency', {
    extend: 'Ext.app.Controller',


    // mutable state
    config: {

        /**
         * @private
         * Passed in when the studentCompetencyPopover is loaded for a student
         */
        studentSparkpoint: null,

        /**
         * @private
         * The target cell block element to show the studentCompetencyPopover at.
         */
        showByTarget: null
    },


    // dependencies
    views: [
        'competencies.StudentCompetencyPanel'
    ],

    stores: [
        'Activities@SparkClassroom.store',
        'Students@SparkClassroom.store',
        'work.Learns@SparkClassroom.store'
    ],


    // component references
    refs: {
        competenciesGrid: 'spark-competencies spark-competencies-grid',

        studentCompetencyPopover: {
            selector: 'spark-studentcompetency-popover',
            xtype: 'spark-studentcompetency-popover',
            autoCreate: true
        },

        popoverTable: 'spark-studentcompetency-popover component[cls~=studentcompetency-popover-table]',
        addToQueueButton: 'spark-studentcompetency-popover button[cls~=add-to-queue-button]',
        addNextUpButton: 'spark-studentcompetency-popover button[cls~=add-next-up-button]',
        giveCreditButton: 'spark-studentcompetency-popover button[cls~=give-credit-button]',
        describeTextArea: 'spark-studentcompetency-popover textareafield[cls~=popover-describe-field]',
        learnCheckbox: 'spark-studentcompetency-popover input[data-phase="Learn"]',
        conferenceCheckbox: 'spark-studentcompetency-popover input[data-phase="Conference"]',
        applyCheckbox: 'spark-studentcompetency-popover input[data-phase="Apply"]',
        assessCheckbox: 'spark-studentcompetency-popover input[data-phase="Assess"]'
    },


    // entry points
    listen: {
        controller: {
            '#': {
                studentsparkpointchange: 'onInitializeStudentSparkpoint'
            }
        }
    },

    control: {
        store: {
            '#Activities': {
                update: 'loadDataIntoView'
            }
        },

        studentCompetencyPopover: {
            hide: {
                fn: 'onHidePanel'
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


    // event handlers
    onInitializeStudentSparkpoint: function(studentSparkpoint, showByTarget) {
        var me = this,
            store = me.getWorkLearnsStore(),
            proxy = store.getProxy()

        me.setStudentSparkpoint(studentSparkpoint);
        me.setShowByTarget(showByTarget);

        me.getCompetenciesGrid().setMasked({
            xtype: 'loadmask',
            message: 'Loading Student Competency'
        });

        proxy.setExtraParam('student_id', studentSparkpoint.get('student_id'));
        proxy.setExtraParam('sparkpoint', studentSparkpoint.get('sparkpoint'));

        store.load({
            callback: function() {
                var popover = me.getStudentCompetencyPopover();

                me.loadDataIntoView();
                me.getCompetenciesGrid().unmask();
                popover.showBy(showByTarget, 'tc-cc?');
            }
        });

        return;
    },

    onHidePanel: function() {
        var model = this.getStudentSparkpoint();

        if (model.dirty) {
            model.reject();
        }
    },


    // custom controller methods
    loadDataIntoView: function() {
        var me = this,
            studentStore = me.getStudentsStore(),
            learnsStore = me.getWorkLearnsStore(),
            learns = learnsStore.getRange(),
            completedRequiredLearns = 0,
            requiredLearns = 0,
            sparkData = me.getStudentSparkpoint().getData(),
            studentId = sparkData.student_id,
            studentData = studentStore.findRecord('ID', studentId).getData(),
            describeText = me.getDescribeTextArea(),
            giveCreditBtn = me.getGiveCreditButton(),
            assessDisabled, assessChecked, applyDisabled, applyChecked, confDisabled,
            confChecked, learnDisabled, learnChecked, allFinished,
            learn, learnAssignments, count = 0;

        for (; count < learns.length; count++) {
            learn = learns[count];
            learnAssignments = learn.get('assignments');

            if (learnAssignments.section == 'required-first' || learnAssignments.student == 'required-first'
                || learnAssignments.section == 'required' || learnAssignments.student == 'required') {
                if (learn.get('completed')) {
                    completedRequiredLearns++;
                }
                requiredLearns++;
            }
        }

        // Teachers can only disable an override if a student hasn't completed or had a later phase overridden
        assessDisabled = !Ext.isEmpty(sparkData.assess_finish_time);
        assessChecked = assessDisabled || !Ext.isEmpty(sparkData.assess_override_time);
        applyDisabled = assessDisabled || assessChecked || !Ext.isEmpty(sparkData.apply_finish_time);
        applyChecked = applyDisabled || !Ext.isEmpty(sparkData.apply_override_time);
        confDisabled = applyDisabled || applyChecked || !Ext.isEmpty(sparkData.conference_finish_time);
        confChecked = confDisabled || !Ext.isEmpty(sparkData.conference_override_time);
        learnDisabled = confDisabled || confChecked || !Ext.isEmpty(sparkData.learn_completed_time);
        learnChecked = learnDisabled || !Ext.isEmpty(sparkData.learn_override_time);
        allFinished = !Ext.isEmpty(sparkData.learn_completed_time) && !Ext.isEmpty(sparkData.conference_finish_time) && !Ext.isEmpty(sparkData.apply_finish_time) && !Ext.isEmpty(sparkData.assess_finish_time);

        me.getPopoverTable().updateData({
            studentName: studentData.FullName,
            sparkpointCode: sparkData.sparkpoint,
            // TODO: calculate whether they receive class/desc for is-not-started is-on-pace is-behind is-ahead, possibly from API call?
            paceCls: 'is-not-started',
            paceDesc: 'Not Started Yet',
            phases: [{
                phase: 'Learn',
                status: completedRequiredLearns + '/' + requiredLearns,
                finished: !Ext.isEmpty(sparkData.learn_finish_time),
                disabled: learnDisabled,
                checked: learnChecked,
                expected: sparkData.learn_pace_target,
                actual: ''
            }, {
                phase: 'Conference',
                status: 'Waiting',
                finished: !Ext.isEmpty(sparkData.conference_finish_time),
                disabled: confDisabled,
                checked: confChecked,
                expected: sparkData.conference_pace_target,
                actual: ''
            }, {
                phase: 'Apply',
                status: 'Not Started',
                finished: !Ext.isEmpty(sparkData.apply_finish_time),
                disabled: applyDisabled,
                checked: applyChecked,
                expected: sparkData.apply_pace_target,
                actual: ''
            }, {
                phase: 'Assess',
                status: 'Not Started',
                finished: !Ext.isEmpty(sparkData.assess_finish_time),
                disabled: assessDisabled,
                checked: assessChecked,
                expected: sparkData.assess_pace_target,
                actual: ''
            }]
        });

        if (allFinished) {
            describeText.hide();
            giveCreditBtn.hide();
        } else {
            describeText.show();
            giveCreditBtn.show();
            describeText.setLabel('Please explain how ' + studentData.FirstName + ' earned credit:');
            describeText.setValue(sparkData.override_reason);
        }

        me.getStudentCompetencyPopover().unmask();
    },

    bindClickPopoverTable: function(cmp) {
        var me = this,
            activeCheckboxes = Ext.get(cmp.el.select('input.not-finished', true));
            
        activeCheckboxes.on({
            'change': function(e, target) {
                me.onPhaseCheckChange(e, target);
            }
        });
    },

    onPhaseCheckChange: function(e, target) {
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
    },

    giveCredit: function() {
        var me = this,
            describeText = me.getDescribeTextArea().getValue(),
            record = me.getStudentSparkpoint();

        record.set('override_reason', describeText);

        if (record.dirty) {
            record.save({
                // hide on callback to ensure dirty status is cleared on hide
                callback: function() {
                    me.getStudentCompetencyPopover().hide();
                }
            });

            return;
        }

        me.getStudentCompetencyPopover().hide();
    },

    // TODO: Implement Add to Queue button
    addToQueue: function() {
        Ext.emptyFn();
    },

    // TODO: Implement Add Next Up button
    addNextUp: function() {
        Ext.emptyFn();
    }
});