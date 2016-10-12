/* global SparkClassroom */
/**
 * Manages the floating panel that displays when you click on a spark point in the Sparkpoint Overview.
 *
 * ## Responsibilities
 * - Allow teacher to override and provide a reason.
 * - Write override times to the store
 */
Ext.define('SparkClassroomTeacher.controller.competencies.StudentCompetency', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkClassroom.timing.DurationDisplay'
    ],


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
        'CompetencySparkpoints@SparkClassroomTeacher.store',
        'Students@SparkClassroom.store',
        'work.Learns@SparkClassroom.store'
    ],


    // component references
    refs: {
        appCt: 'spark-teacher-appct',
        competenciesGrid: 'spark-competencies spark-competencies-grid',

        studentCompetencyPopover: {
            selector: 'spark-studentcompetency-popover',
            xtype: 'spark-studentcompetency-popover',
            autoCreate: true
        },

        popoverTable: 'spark-studentcompetency-popover component[cls~=studentcompetency-popover-table]',
        addToQueueButton: 'spark-studentcompetency-popover button[cls~=add-to-queue-button]',
        addNextUpButton: 'spark-studentcompetency-popover button[cls~=add-next-up-button]',
        lowerButtonCt: 'spark-studentcompetency-popover component[cls~=lower-button-ct]',
        giveCreditButton: 'spark-studentcompetency-popover button[cls~=give-credit-button]',
        describeTextArea: 'spark-studentcompetency-popover textareafield[cls~=popover-describe-field]'
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
            '#CompetencySparkpoints': {
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
                fn: 'onAddToQueue'
            }
        },

        addNextUpButton: {
            tap: {
                fn: 'onAddNextUp'
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

    onPhaseCheckChange: function(e, target, updateButton) {
        var me = this,
            updateButton = Ext.isEmpty(updateButton), // true by default
            el = Ext.get(target),
            checked = el.is(':checked'),
            phaseName = el.getAttribute('data-phase'),
            record = me.getStudentSparkpoint(),
            phasesData = me.getPopoverTable().getData().phases,
            phaseData,
            count,
            chainCheckbox,
            fieldName,
            value;

        switch (phaseName) {
            case 'Learn':
                fieldName = 'learn_override_time';
                break;
            case 'Conference':
                fieldName = 'conference_override_time';
                chainCheckbox = el.up('.spark-studentcompetency-popover-table').down('input[data-phase="Learn"]')
                break;
            case 'Apply':
                fieldName = 'apply_override_time';
                chainCheckbox = el.up('.spark-studentcompetency-popover-table').down('input[data-phase="Conference"]');
                break;
            case 'Assess':
                fieldName = 'assess_override_time';
                chainCheckbox = el.up('.spark-studentcompetency-popover-table').down('input[data-phase="Apply"]');

                // Hide these buttons when last phase is completed
                if (checked) {
                    me.getLowerButtonCt().hide();
                } else {
                    me.getLowerButtonCt().show();
                }

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

            me.onPhaseCheckChange(null, chainCheckbox, false);
        }

        // If we unchecked this then remove disabled state if the prev phase wasn't finished
        if (!Ext.isEmpty(chainCheckbox) && !checked) {
            if (!chainCheckbox.hasCls('finished')) {
                chainCheckbox.dom.removeAttribute('disabled');
            }
        }

        value = checked ? new Date() : null;

        record.set(fieldName, value);

        // Only update button text on first call to this method (not in the chain)
        if (!updateButton) {
            return;
        }

        // Check the original data to see if this has changed, essentially a dirty check
        for (count = 0; count < phasesData.length; count++) {
            phaseData = phasesData[count];

            if (phaseName !== phaseData.phase) {
                continue;
            }

            if (phaseData.checked && !checked) {
                me.getGiveCreditButton().setText('Remove Credit');
            } else {
                me.getGiveCreditButton().setText('Give Credit');
            }
        }
    },

    onAddToQueue: function() {
        this.addToQueue(false);
    },

    onAddNextUp: function() {
        this.addToQueue(true);
    },


    // custom controller methods
    // TODO: comment below will silence eslint complexity warning, but perhaps we should work on lessening the complexity of this function
    loadDataIntoView: function() {  // eslint-disable-line complexity
        var me = this,
            studentStore = me.getStudentsStore(),
            learnsStore = me.getWorkLearnsStore(),
            learns = learnsStore.getRange(),
            completedRequiredLearns = 0,
            requiredLearns = 0,
            sparkData = me.getStudentSparkpoint().getData(),
            studentId = sparkData.student_id,
            sectionCode = sparkData.senction_code,
            studentData = studentStore.findRecord('ID', studentId).getData(),
            describeText = me.getDescribeTextArea(),
            giveCreditBtn = me.getGiveCreditButton(),
            assessDisabled, assessChecked, applyDisabled, applyChecked, confDisabled,
            confChecked, learnDisabled, learnChecked, allFinished,
            learnStatus, confStatus, applyStatus, assessStatus,

            learn, learnAssignments, count = 0;

        for (; count < learns.length; count++) {
            learn = learns[count];
            learnAssignments = learn.get('assignments');

            if (learnAssignments.section === 'required-first' || learnAssignments.student === 'required-first'
                || learnAssignments.section === 'required' || learnAssignments.student === 'required') {
                if (learn.get('completed')) {
                    completedRequiredLearns++;
                }
                requiredLearns++;
            }
        }

        // Teachers can only disable an override if a student hasn't completed or had a later phase overridden
        assessDisabled = !Ext.isEmpty(sparkData.assess_finish_time);
        assessChecked = assessDisabled || !Ext.isEmpty(sparkData.assess_override_time);

        if (Ext.isEmpty(sparkData.assess_start_time)) {
            assessStatus = 'Not Started';
        } else if (Ext.isEmpty(sparkData.assess_completed_time)) {
            assessStatus = 'Working';
        } else {
            assessStatus = 'Completed';
        }

        applyDisabled = assessDisabled || assessChecked || !Ext.isEmpty(sparkData.apply_finish_time);
        applyChecked = applyDisabled || !Ext.isEmpty(sparkData.apply_override_time);

        if (Ext.isEmpty(sparkData.apply_start_time)) {
            applyStatus = 'Not Started';
        } else if (Ext.isEmpty(sparkData.apply_completed_time)) {
            applyStatus = 'Working';
        } else {
            applyStatus = 'Completed';
        }

        confDisabled = applyDisabled || applyChecked || !Ext.isEmpty(sparkData.conference_finish_time);
        confChecked = confDisabled || !Ext.isEmpty(sparkData.conference_override_time);

        if (Ext.isEmpty(sparkData.conference_start_time)) {
            confStatus = 'Not Started';
        } else if (Ext.isEmpty(sparkData.conference_completed_time)) {
            confStatus = 'Waiting';
        } else {
            confStatus = 'Completed';
        }

        learnDisabled = confDisabled || confChecked || !Ext.isEmpty(sparkData.learn_completed_time);
        learnChecked = learnDisabled || !Ext.isEmpty(sparkData.learn_override_time);
        learnStatus = completedRequiredLearns + '/' + requiredLearns;
        allFinished = !Ext.isEmpty(sparkData.learn_completed_time) && !Ext.isEmpty(sparkData.conference_finish_time) && !Ext.isEmpty(sparkData.apply_finish_time) && !Ext.isEmpty(sparkData.assess_finish_time);

        me.getPopoverTable().setData({
            studentName: studentData.FullName,
            sparkpointCode: sparkData.sparkpoint,
            phases: [{
                phase: 'Learn',
                status: learnStatus,
                finished: !Ext.isEmpty(sparkData.learn_finish_time),
                disabled: learnDisabled,
                checked: learnChecked,
                expected: sparkData.learn_pace_target,
                actual: me.getPhaseDuration(sectionCode, sparkData.learn_start_time, sparkData.learn_completed_time)
            }, {
                phase: 'Conference',
                status: confStatus,
                finished: !Ext.isEmpty(sparkData.conference_finish_time),
                disabled: confDisabled,
                checked: confChecked,
                expected: sparkData.conference_pace_target,
                actual: me.getPhaseDuration(sectionCode, sparkData.learn_start_time, sparkData.conference_completed_time)
            }, {
                phase: 'Apply',
                status: applyStatus,
                finished: !Ext.isEmpty(sparkData.apply_finish_time),
                disabled: applyDisabled,
                checked: applyChecked,
                expected: sparkData.apply_pace_target,
                actual: me.getPhaseDuration(sectionCode, sparkData.learn_start_time, sparkData.apply_completed_time)
            }, {
                phase: 'Assess',
                status: assessStatus,
                finished: !Ext.isEmpty(sparkData.assess_finish_time),
                disabled: assessDisabled,
                checked: assessChecked,
                expected: sparkData.assess_pace_target,
                actual: me.getPhaseDuration(sectionCode, sparkData.learn_start_time, sparkData.assess_completed_time)
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

        // Hide these buttons when last phase is completed
        if (assessChecked) {
            me.getLowerButtonCt().hide();
        } else {
            me.getLowerButtonCt().show();
        }

        me.getStudentCompetencyPopover().unmask();
    },

    getPhaseDuration: function(sectionCode, startDate, endDate) {
        if (Ext.isEmpty(startDate) || Ext.isEmpty(endDate)) {
            return null;
        }
        return SparkClassroom.timing.DurationDisplay.calculateDuration(sectionCode, startDate, endDate, true, true);
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

    addToQueue: function(nextUp) {
        var me = this,
            studentSparkpoint = me.getStudentSparkpoint(),
            recommendedTime = new Date(),
            studentId = studentSparkpoint.get('student_id');

        if (nextUp) {
            recommendedTime = me.getNextUpTime(studentId);
        }

        Slate.API.request({
            method: 'POST',
            url: '/spark/api/sparkpoints/suggest',
            jsonData: [{
                'student_id': studentId,
                'section_code': me.getAppCt().getSelectedSection(),
                'sparkpoint_code': studentSparkpoint.get('sparkpoint'),
                'recommended_time': recommendedTime
            }],
            callback: function(options, success) {
                if (!success) {
                    Ext.Msg.alert('Error Adding to Queue', 'This sparkpoint could not be recommended, please try again or contact an administrator');
                    return;
                }

                me.getStudentCompetencyPopover().hide();
            },
            scope: me
        });
    },

    getNextUpTime: function(studentId) {
        var me = this,
            competencySparkpointsStore = me.getCompetencySparkpointsStore(),
            studentSparkpoints,
            currentNextUpTime;

        // get all of this student's sparkpoints that have a valid recommended time and sort by earliest recommended
        studentSparkpoints = competencySparkpointsStore.queryBy(function(rec) {
            return rec.get('student_id') === studentId && Ext.isDate(rec.get('recommended_time'));
        }).sort('recommended_time', 'ASC').items;

        // set the current next up time, if one doesn't exist, tnow is next up time
        currentNextUpTime = studentSparkpoints[0] ? studentSparkpoints[0].get('recommended_time') : new Date();

        // new next up time is a minute before current next up time
        return Ext.Date.subtract(currentNextUpTime, Ext.Date.MINUTE, 1);
    }
});
