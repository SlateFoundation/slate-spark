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
        'ConfigSparkpoints@SparkClassroomTeacher.store.competencies',
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

        appCt: {
            selectedsectionchange: 'onSelectedSectionChange'
        },
        sparkpointField: 'spark-sparkpointsconfig-window spark-sparkpointfield',

        configTableActive: 'spark-sparkpointsconfig-window component[cls*=sparkpointsconfig-table active]',
        configTableCurrent: 'spark-sparkpointsconfig-window component[cls*=sparkpointsconfig-table current]',
        configTableQueue: 'spark-sparkpointsconfig-window component[cls*=sparkpointsconfig-table queue]',
        doneButton: 'spark-sparkpointsconfig-window button[cls*=sparkpointsconfig-done-button]',
        sparkpointRows: 'spark-sparkpointsconfig-window tr[cls~=sparkpoint-row]'
    },

    // entry points
    listen: {
        controller: {
            '#': {
                activestudentidchange: 'initializeStudent'
            }
        },

        store: {
            '#ConfigSparkpoints': {
                load: 'loadDataIntoView'
            }
        }
    },

    control: {
        doneButton: {
            tap: {
                fn: 'onDoneTap'
            }
        },

        sparkpointsConfigWindow: {
            hide: {
                fn: 'onHideWindow'
            }
        },

        appCt: {
            initialize: 'onInitializeAppCt'
        },

        sparkpointField: {
            sparkpointselect: 'suggestNextSparkpoint'
        }
    },

    onInitializeAppCt: function() {
        this.getAppCt().add(this.getStudentCompetencyPopover());
    },

    initializeStudent: function(studentId) {
        var me = this,
            configStore = me.getConfigSparkpointsStore();

        me.setActiveStudentId(studentId);

        configStore.getProxy().setExtraParam('student_id', studentId);

        configStore.load(function() {
            me.loadDataIntoView();
            me.getSparkpointsConfigWindow().show();
        });
    },

    loadDataIntoView: function() {
        var me = this,
            sparkpointField,
            studentStore = me.getStudentsStore(),
            studentId = me.getActiveStudentId(),
            configSparkpointsStore = me.getConfigSparkpointsStore(),
            studentRec = studentStore.getById(studentId),
            studentData = studentRec.getData(),
            activeSparkpoints, queuedSparkpoints,
            count,
            sparkpoint,
            assessDisabled, assessChecked, applyDisabled, applyChecked, confDisabled,
            confChecked, learnDisabled, learnChecked,
            activeTableData = [],
            queuedTableData = [],
            currentTableData = [],
            lastAccessedIndex = 0;

        activeSparkpoints = configSparkpointsStore.queryBy(function(rec) {
            return !Ext.isEmpty(rec.get('learn_start_time')) && rec.get('student_id') === studentData.ID;
        }).sort('recommended_time', 'ASC').getRange();

        queuedSparkpoints = configSparkpointsStore.queryBy(function(rec) {
            return Ext.isEmpty(rec.get('learn_start_time')) && rec.get('student_id') === studentData.ID;
        }).sort('recommended_time', 'ASC').getRange();

        me.getSparkpointsConfigWindow().setTitle(studentData.FullName);

        for (count = 0; count < activeSparkpoints.length; count++) {
            sparkpoint = activeSparkpoints[count];

            if (sparkpoint.get('last_accessed') > activeSparkpoints[lastAccessedIndex].get('last_accessed')) {
                lastAccessedIndex = count;
            }

            // Teachers can only disable an override if a student hasn't completed or had a later phase overridden
            assessDisabled = !Ext.isEmpty(sparkpoint.get('assess_finish_time'));
            assessChecked = assessDisabled || !Ext.isEmpty(sparkpoint.get('assess_override_time'));
            applyDisabled = assessDisabled || assessChecked || !Ext.isEmpty(sparkpoint.get('apply_finish_time'));
            applyChecked = applyDisabled || !Ext.isEmpty(sparkpoint.get('apply_override_time'));
            confDisabled = applyDisabled || applyChecked || !Ext.isEmpty(sparkpoint.get('conference_finish_time'));
            confChecked = confDisabled || !Ext.isEmpty(sparkpoint.get('conference_override_time'));
            learnDisabled = confDisabled || confChecked || !Ext.isEmpty(sparkpoint.get('learn_finish_time'));
            learnChecked = learnDisabled || !Ext.isEmpty(sparkpoint.get('learn_override_time'));

            activeTableData.push({
                'student_sparkpointid': sparkpoint.get('student_sparkpointid'),
                'sparkpoint': sparkpoint.get('code'),
                'phases': [{
                    phase: 'Learn',
                    finished: !Ext.isEmpty(sparkpoint.get('learn_finish_time')),
                    disabled: learnDisabled,
                    checked: learnChecked,
                    expected: sparkpoint.get('learn_pace_target'),
                    actual: sparkpoint.get('learn_pace_actual')
                }, {
                    phase: 'Conference',
                    finished: !Ext.isEmpty(sparkpoint.get('conference_finish_time')),
                    disabled: confDisabled,
                    checked: confChecked,
                    expected: sparkpoint.get('conference_pace_target'),
                    actual: sparkpoint.get('conference_pace_actual')
                }, {
                    phase: 'Apply',
                    finished: !Ext.isEmpty(sparkpoint.get('apply_finish_time')),
                    disabled: applyDisabled,
                    checked: applyChecked,
                    expected: sparkpoint.get('apply_pace_target'),
                    actual: sparkpoint.get('apply_pace_actual')
                }, {
                    phase: 'Assess',
                    finished: !Ext.isEmpty(sparkpoint.get('assess_finish_time')),
                    disabled: assessDisabled,
                    checked: assessChecked,
                    expected: sparkpoint.get('assess_pace_target'),
                    actual: sparkpoint.get('assess_pace_actual')
                }]
            });
        }

        // move last accessed sparkpoint to current table data
        currentTableData.push(activeTableData.splice(lastAccessedIndex, 1)[0]);

        for (count = 0; count < queuedSparkpoints.length; count++) {
            sparkpoint = queuedSparkpoints[count];

            queuedTableData.push({
                'student_sparkpointid': sparkpoint.get('student_sparkpointid'),
                'sparkpoint': sparkpoint.get('code'),
                'phases': [{
                    phase: 'Learn',
                    expected: sparkpoint.get('learn_pace_target')
                }, {
                    phase: 'Conference',
                    expected: sparkpoint.get('conference_pace_target')
                }, {
                    phase: 'Apply',
                    expected: sparkpoint.get('apply_pace_target')
                }, {
                    phase: 'Assess',
                    expected: sparkpoint.get('assess_pace_target')
                }]
            });
        }

        if (currentTableData.length == 0) {
            me.getConfigTableCurrent().hide();
        } else {
            me.getConfigTableCurrent().updateData(currentTableData);
            me.getConfigTableCurrent().show();
        }

        if (activeTableData.length == 0) {
            me.getConfigTableActive().hide();
        } else {
            me.getConfigTableActive().updateData(activeTableData);
            me.getConfigTableActive().show();
        }

        if (queuedTableData.length == 0) {
            me.getConfigTableQueue().hide();
        } else {
            me.getConfigTableQueue().updateData(queuedTableData);
            me.getConfigTableQueue().show();
        }

        sparkpointField = me.getSparkpointField(); // Declared now since it will have rendered

        me.bindPaceFields();
        me.bindReordering();
        me.bindRemoveBtns();

        sparkpointField.filterFn = function(rec) { // Note - setter wasn't working
            // only show sparkpoints that are not already associated with this student
            return Ext.getStore('ConfigSparkpoints').find('sparkpoint_id', rec.data.id) === -1;
        };

        sparkpointField.updateSelectedStudent(studentId);
        sparkpointField.getSuggestionsList().setWidth(500);
    },

    bindPaceFields: function() {
        var me = this,
            paceFields = me.getSparkpointsConfigWindow().element.select('input.expected-completion').elements,
            paceField,
            count;

        for (count = 0; count < paceFields.length; count++) {
            paceField = Ext.get(paceFields[count]);
            paceField.on('change', function(e, el) {
                me.onPaceFieldChange(e, el);
            });

            // Bind on blur as well to detect user interaction incase they want to explicity set a default.
            paceField.on('blur', function(e, el) {
                me.onPaceFieldChange(e, el);
            });
        }
    },

    bindReordering: function() {
        var me = this,
            sortArrows = me.getSparkpointsConfigWindow().element.select('.row-reorder-buttons i').elements,
            arrow,
            count;

        for (count = 0; count < sortArrows.length; count++) {
            arrow = Ext.get(sortArrows[count]);
            arrow.on('click', function(e, el) {
                me.onSortArrowClick(e, el);
            });
        }
    },

    bindRemoveBtns: function() {
        var me = this,
            removeBtns = me.getSparkpointsConfigWindow().element.select('.remove-cell button[action="row-remove"]').elements,
            removeBtn,
            count;

        for (count = 0; count < removeBtns.length; count++) {
            removeBtn = Ext.get(removeBtns[count]);

            removeBtn.on('click', function(e, el) {
                me.onRemoveSparkpoint(e, el);
            });
        }
    },

    onPaceFieldChange: function(e, el) {
        var configSparkpointsStore = this.getConfigSparkpointsStore(),
            paceField = Ext.get(el),
            paceFieldVal = paceField.getValue(),
            phase = paceField.getAttribute('data-phase'),
            studentSparkpointId = paceField.up('tr.sparkpoint-row').getAttribute('data-student-sparkpointid'),
            sparkpoint = configSparkpointsStore.findRecord('student_sparkpointid', studentSparkpointId),
            prevCell = paceField.up('td').prev('td'),
            nextCell = paceField.up('td').next('td'),
            prevInput,
            nextInput;

        if (!Ext.isEmpty(prevCell)) {
            prevInput = prevCell.down('input.expected-completion');

            // Prevent setting future phase pace before previous phase
            if (prevInput && parseInt(paceFieldVal, 10) <= parseInt(prevInput.getValue(), 10)) {
                Ext.Msg.alert('Invalid Target Pace', 'The ' + paceField.getAttribute('data-phase') + ' must be done after the ' + prevInput.getAttribute('data-phase') + ' phase. Please enter a completion day that is after the ' + prevInput.getAttribute('data-phase') + ' phase.', function() {
                    paceField.focus(50);
                });

                paceField.dom.value = parseInt(prevInput.getValue(), 10) + 1;
            }
        }

        if (!Ext.isEmpty(nextCell)) {
            nextInput = nextCell.down('input.expected-completion');

            // Prevent setting previous phase pace before next phase
            if (nextInput && parseInt(paceFieldVal, 10) >= parseInt(nextInput.getValue(), 10)) {
                Ext.Msg.alert('Invalid Target Pace', 'The ' + paceField.getAttribute('data-phase') + ' must be done before the ' + nextInput.getAttribute('data-phase') + ' phase. Please enter a completion day that is before the ' + nextInput.getAttribute('data-phase') + ' phase.', function() {
                    paceField.focus(50);
                });

                paceField.dom.value = parseInt(nextInput.getValue(), 10) - 1;
            }
        }

        sparkpoint.set(phase.toLowerCase() + '_pace_target', paceField.getValue());
    },

    onSortArrowClick: function(e, el) {
        var me = this,
            sparkConfigStore = me.getConfigSparkpointsStore(),
            arrow = Ext.get(el),
            sparkRow = arrow.up('tr.sparkpoint-row'),
            siblingSparkRows = sparkRow.up('.sparkpointsconfig-table').query('.sparkpoint-row'),
            studentSparkpointId = sparkRow.getAttribute('data-student-sparkpointid'),
            sparkpoint = sparkConfigStore.findRecord('student_sparkpointid', studentSparkpointId),
            neighborSparkpoint,
            sortDirection,
            sortableSparkpoint,
            count,
            minutes;

        if (arrow.hasCls('fa-arrow-down')) {
            neighborSparkpoint = sparkConfigStore.findRecord('student_sparkpointid', sparkRow.next('tr.sparkpoint-row').getAttribute('data-student-sparkpointid'));
            sortDirection = 'down';

        } else {
            neighborSparkpoint = sparkConfigStore.findRecord('student_sparkpointid', sparkRow.prev('tr.sparkpoint-row').getAttribute('data-student-sparkpointid'));
            sortDirection = 'up';
        }

        // loop through all sparkpoints in this table and set recommended_time to now + index,
        // change the index either up or down for sparkpoint/neighborsparkpoint so they switch positions appropriately
        for (count = 0; count < siblingSparkRows.length; count++) {
            sortableSparkpoint = sparkConfigStore.findRecord('student_sparkpointid', siblingSparkRows[count].getAttribute('data-student-sparkpointid'));
            minutes = count;

            if (sortableSparkpoint === sparkpoint) {
                minutes = sortDirection === 'down' ? minutes + 1 : minutes - 1;
            } else if (sortableSparkpoint === neighborSparkpoint) {
               minutes = sortDirection === 'down' ? minutes - 1 : minutes + 1;
            }

            sortableSparkpoint.set('recommended_time', Ext.Date.add(new Date(), Ext.Date.MINUTE, minutes));
        }

        me.loadDataIntoView();
    },

    onRemoveSparkpoint: function(e, el) {
        var me = this,
            configStore = me.getConfigSparkpointsStore(),
            sparkRow = Ext.get(el).up('tr.sparkpoint-row'),
            studentSparkpointId = sparkRow.getAttribute('data-student-sparkpointid'),
            sparkpoint = configStore.findRecord('student_sparkpointid', studentSparkpointId);

        if (Ext.isEmpty(sparkpoint)) {
            return;
        }

        sparkpoint.getProxy().setExtraParams({
            'student_id': sparkpoint.get('student_id'),
            'section_id': sparkpoint.get('section_id'),
            'sparkpoint': sparkpoint.get('sparkpoint')
        });

        sparkpoint.erase({
            failure: function(rec, op) {
                var error = op && op.error && op.error.statusText;

                Ext.Msg.alert('Error', 'Unable to remove this sparkpoint. (' + error + ')');
            },
            success: function() {
                this.loadDataIntoView();
            },
            scope: me
        });
    },

    onHideWindow: function() {
        var configStore = this.getConfigSparkpointsStore();

        configStore.rejectChanges();
    },

    onDoneTap: function() {
        var me = this,
            configStore = me.getConfigSparkpointsStore(),
            // DomQuery usage due to the fact refs do not allow multiple selections
            sparkpointRows = Ext.query('.spark-sparkpointsconfig-window tr.sparkpoint-row'),
            rowElement,
            row,
            studentSparkpointId,
            sparkpoint;

        // Save dirty sparkpoints as records may be changed earlier
        for (row = 0; row < sparkpointRows.length; row++) {
            rowElement = Ext.fly(sparkpointRows[row]);
            studentSparkpointId = rowElement.getAttribute('data-student-sparkpointid');
            sparkpoint = configStore.findRecord('student_sparkpointid', studentSparkpointId);

            if (sparkpoint && sparkpoint.dirty) {
                sparkpoint.save();
            }
        }

        me.getSparkpointsConfigWindow().hide();
    },

    suggestNextSparkpoint: function() {
        var me = this,
            studentId = me.getActiveStudentId(),
            sparkpointField = me.getSparkpointField(),
            recommendedSparkpoint = sparkpointField.getSelectedSparkpoint();

        if (!recommendedSparkpoint) {
            return;
        }

        Slate.API.request({
            method: 'PATCH',
            url: '/spark/api/work/activity',
            jsonData: {
                'sparkpoint': recommendedSparkpoint.getId(),
                'student_id': studentId
            },
            callback: function(options, success) {
                if (!success) {
                    Ext.Msg.alert('Failed to recommend sparkpoint', 'This sparkpoint could not be added to the student\'s recommended sparkpoints, please try again or contact an administrator');
                    return;
                }

                this.getConfigSparkpointsStore().load();

                sparkpointField.setSelectedSparkpoint(null);
                sparkpointField.setQuery(null);
            },
            scope: me
        });
    }
});
