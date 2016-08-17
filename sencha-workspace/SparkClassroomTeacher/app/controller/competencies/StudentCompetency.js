/**
 * Manages the floating panel that displays when you click on a spark point in the Sparkpoint Overview.
 *
 * ## Responsibilities
 * - Allow teacher to override and provide a reason.
 * - Write override times to the store
 *
 * ## Properties
 * - studentSparkPoint: Passed in when the studentCompetencyPopover is loaded for a student
 * - showByTarget: Passed in when the studentCompetencyPopover is loaded for a student
 */
Ext.define('SparkClassroomTeacher.controller.competencies.StudentCompetency', {
    extend: 'Ext.app.Controller',

    stores: [
        'Activities@SparkClassroom.store',
        'Students@SparkClassroom.store',
        'work.Learns@SparkClassroom.store'
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
            loadstudentsparkpoint: {
                fn: 'onInitializeStudentSparkpoint'
            },
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

    loadWorkLearnsStore: function(studentSparkpointId) {
        var me = this,
            store = me.getWorkLearnsStore(),
            proxy = store.getProxy(),
            studentSparkpoint = this.getStudentSparkPoint(studentSparkpointId);

        proxy.setExtraParam('student_id', studentSparkpoint.get('student_id'));
        proxy.setExtraParam('sparkpoint', studentSparkpoint.get('sparkpoint'));

        store.load({
            callback: function() {
                this.loadDataIntoView();
                this.getCompetenciesGrid().unmask();
                this.getStudentCompetencyPopover().showBy(this.showByTarget, 'tc-cc?');
            },
            scope: this
        });

        return;
    },

    onInitializeStudentSparkpoint: function(studentSparkpointId, target) {
        this.getCompetenciesGrid().setMasked({
            xtype: 'loadmask',
            message: 'Loading Student Competency'
        });

        this.showByTarget = target;
        this.loadWorkLearnsStore(studentSparkpointId);
    },

    onHidePanel: function() {
        var model = this.getStudentSparkPoint();

        if(model.dirty) {
            model.reject();
        }
    },

    /**
     *
     * @param {String} studentSparkpointId (Optional)
     * @returns {Ext.data.Model}
     */
    getStudentSparkPoint: function(studentSparkpointId) {
        if(Ext.isEmpty(this.studentSparkPoint) || !Ext.isEmpty(studentSparkpointId)) {
            var activityStore = Ext.getStore('Activities');
            this.studentSparkPoint = activityStore.getAt(activityStore.find('student_sparkpointid', studentSparkpointId));
        }

        return this.studentSparkPoint;
    },

    getLearnCheckbox: function() {
        return Ext.get(this.getPopoverTable().element.select('input[data-phase="Learn"]').elements[0]);
    },

    getConferenceCheckbox: function() {
        return Ext.get(this.getPopoverTable().element.select('input[data-phase="Conference"]').elements[0]);
    },

    getApplyCheckbox: function() {
        return Ext.get(this.getPopoverTable().element.select('input[data-phase="Apply"]').elements[0]);
    },

    getAssessCheckbox: function() {
        return Ext.get(this.getPopoverTable().element.select('input[data-phase="Assess"]').elements[0]);
    },

    loadDataIntoView: function() {
        var studentStore = this.getStudentsStore(),
            learnsStore = this.getWorkLearnsStore(),
            learnsRawData = learnsStore.getProxy().getReader().rawData,
            learns = learnsStore.getRange(),
            learnsRequiredSection = learnsRawData.learns_required.section,
            learnsRequiredStudent = learnsRawData.learns_required.student,
            completedLearns = 0,
            minimumRequired = 0,
            completedRequiredLearns = 0,
            requiredLearns = 0,
            sparkData = this.getStudentSparkPoint().getData(),
            studentId = sparkData.student_id,
            studentData = studentStore.findRecord('ID', studentId).getData();

        // Calculate Learns phase status value.
        if (learnsRawData && learnsRawData.learns_required && learnsRawData.learns_required.site) {
            minimumRequired = Math.min(learns.length, learnsRawData.learns_required.site);
        }

        if (learnsRequiredStudent !== null) {
            minimumRequired = Math.min(learns.length, learnsRequiredStudent);
        } else if (learnsRequiredSection !== null) {
            minimumRequired = Math.min(learns.length, learnsRequiredSection);
        }

        for (var i = 0; i < learns.length; i++) {
            var learn = learns[i],
                learnAssignments = learn.get('assignments');

            if (learn.get('completed')) {
                completedLearns++;
            }

            if ((learnAssignments.section == 'required-first' || learnAssignments.student == 'required-first'
                || learnAssignments.section == 'required' || learnAssignments.student == 'required')) {
                if (learn.get('completed')) {
                    completedRequiredLearns++;
                }
                requiredLearns++;
            }
        }

        // Teachers can only disable an override if a student hasn't completed or had a later phase overridden
        var assessDisabled = !Ext.isEmpty(sparkData.assess_finish_time),
            assessChecked = assessDisabled || !Ext.isEmpty(sparkData.assess_override_time),
            applyDisabled  = assessDisabled || assessChecked || !Ext.isEmpty(sparkData.apply_finish_time),
            applyChecked = applyDisabled || !Ext.isEmpty(sparkData.apply_override_time),
            confDisabled  = applyDisabled || applyChecked || !Ext.isEmpty(sparkData.conference_finish_time),
            confChecked = confDisabled || !Ext.isEmpty(sparkData.conference_override_time),
            learnDisabled  = confDisabled || confChecked || !Ext.isEmpty(sparkData.learn_finish_time),
            learnChecked = learnDisabled || !Ext.isEmpty(sparkData.learn_override_time),
            allFinished = !Ext.isEmpty(sparkData.learn_finish_time) && !Ext.isEmpty(sparkData.conference_finish_time) && !Ext.isEmpty(sparkData.apply_finish_time) && !Ext.isEmpty(sparkData.assess_finish_time);

        this.getPopoverTable().updateData({
            studentName: studentData.FullName,
            sparkpointCode: sparkData.sparkpoint,
            //TODO: calculate whether they receive class/desc for is-not-started is-on-pace is-behind is-ahead, possibly from API call?
            paceCls: 'is-not-started',
            paceDesc: 'Not Started Yet',
            phases: [{
                phase: 'Learn',
                status: completedRequiredLearns + '/' + requiredLearns,
                finished: !Ext.isEmpty(sparkData.learn_finish_time),
                disabled: learnDisabled,
                checked: learnChecked,
                expected: 0,
                actual: 0
            }, {
                phase: 'Conference',
                status: 'Waiting',
                finished: !Ext.isEmpty(sparkData.conference_finish_time),
                disabled: confDisabled,
                checked: confChecked,
                expected: 0,
                actual: 0
            }, {
                phase: 'Apply',
                status: 'Not Started',
                finished: !Ext.isEmpty(sparkData.apply_finish_time),
                disabled: applyDisabled,
                checked: applyChecked,
                expected: 0,
                actual: 0
            }, {
                phase: 'Assess',
                status: 'Not Started',
                finished: !Ext.isEmpty(sparkData.assess_finish_time),
                disabled: assessDisabled,
                checked: assessChecked,
                expected: 0,
                actual: 0
            }]
        });

        var describeText = this.getDescribeTextArea(),
            giveCreditBtn = this.getGiveCreditButton();

        if(allFinished) {
            describeText.hide();
            giveCreditBtn.hide();
        } else {
            describeText.show();
            giveCreditBtn.show();
            describeText.setLabel('Please explain how ' + studentData.FirstName + ' earned credit:');
            describeText.setValue(sparkData.override_reason);
        }

        this.getStudentCompetencyPopover().unmask();
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
            checked = el.is(':checked'),
            phaseName = el.getAttribute('data-phase'),
            record = this.getStudentSparkPoint(),
            chainCheckbox,
            fieldName;

        switch(phaseName) {
            case 'Learn':
                fieldName = 'learn_override_time';
                break;
            case 'Conference':
                fieldName = 'conference_override_time';
                chainCheckbox = this.getLearnCheckbox();
                break;
            case 'Apply':
                fieldName = 'apply_override_time';
                chainCheckbox = this.getConferenceCheckbox();
                break;
            case 'Assess':
                fieldName = 'assess_override_time';
                chainCheckbox = this.getApplyCheckbox();
                break;
        }

        // If we checked a later phase, ensure that the previous phases are also checked
        if(!Ext.isEmpty(chainCheckbox) && !chainCheckbox.hasCls('finished')) {
            if(!chainCheckbox.is(':disabled')) {
                chainCheckbox.dom.disabled = true;
            }

            if(!chainCheckbox.is(':checked')) {
                chainCheckbox.dom.checked = true;
            }

            this.onPhaseCheckChange(null, chainCheckbox);
        }

        // If we unchecked this then remove disabled state if the prev phase wasn't finished
        if(!Ext.isEmpty(chainCheckbox) && !checked) {
            if(!chainCheckbox.hasCls('finished')) {
                chainCheckbox.dom.removeAttribute('disabled');
            }
        }

        var value = checked ? new Date() : null;

        record.set(fieldName, value);
    },

    giveCredit: function() {
        var describeText = this.getDescribeTextArea().getValue(),
            record = this.getStudentSparkPoint();

        record.set('override_reason', describeText);

        if(record.dirty) {
            record.save({
                // hide on callback to ensure dirty status is cleared on hide
                callback: Ext.Function.pass(function() {
                    this.getStudentCompetencyPopover().hide();
                }, [], this)
            });
        } else {
            this.getStudentCompetencyPopover().hide();
        }
    },

    addToQueue: function() {

    },

    addNextUp: function() {

    }
});