/**
 * The Competencies controller handles activating the top-level
 * "Sparkpoint Overview" tab and manages all UI within it
 *
 * ## Responsibilities
 * - Realize /competencies route
 * - Ensure "Sparkpoint Overview" tab is selected in navbar and
 * teacher tabs when screen gets activated
 */
Ext.define('SparkClassroomTeacher.controller.Competencies', {
    extend: 'Ext.app.Controller',


    // mutable state
    config: {

        /**
         * @private
         * Passed in when the studentCompetencyPopover is loaded for a student
         */
        studentSparkPoint: null,

		/**
		 * @private
         * Set when loading the sparkpointsConfigWindow
         */
        activeStudentId: null,

        /**
         * @private
         * The target cell block element to show the studentCompetencyPopover at.
         */
        showByTarget: null,
    },

    requires: [
        'Slate.proxy.API'
    ],

    views: [
        'competencies.Container'
    ],

    stores: [
        'CompetencySparkpoints@SparkClassroomTeacher.store',
        'Students@SparkClassroom.store',
        'SectionGoals@SparkClassroomTeacher.store.competencies'
    ],

    refs: {
        navBar: 'spark-navbar',
        competenciesNavButton: 'spark-navbar button#competencies',
        tabsCt: 'spark-teacher-tabscontainer',
        teacherTabbar: 'spark-teacher-tabbar',
        sparkpointsColumn: 'spark-sparkpoints-column',

        competenciesCt: {
            selector: 'spark-competencies',
            autoCreate: true,
            xtype: 'spark-competencies'
        },

        appCt: 'spark-teacher-appct',
        competenciesGrid: 'spark-competencies spark-competencies-grid',
        studentCompetencyPopover: 'spark-studentcompetency-popover',
        sparkpointsConfigWindow: 'spark-sparkpointsconfig-window'
    },

    control: {
        competenciesNavButton: {
            tap: 'onNavCompetenciesTap'
        },
        competenciesCt: {
            activate: 'onCompetenciesCtActivate'
        },

        appCt: {
            selectedsectionchange: 'onSelectedSectionChange'
        },

        competenciesGrid: {
            activate: 'refreshColumns',
            itemtap: {
                fn: 'onCompetenciesGridItemTap'
            }
        },

        'spark-student-competency-column': {
            sparkconfigclick: {
                fn: 'onSparkConfigClick'
            },
            sparkgoalclick: {
                fn: 'onSparkGoalClick'
            }
        }
    },

    listen: {
        store: {
            '#CompetencySparkpoints': {
                update: 'onCompetencySparkpointsStoreUpdate',
                load: 'refreshGrid'
            },
            '#Students': {
                load: 'refreshColumns'
            },
            '#SectionGoals': {
                load: 'refreshColumns'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    routes: {
        'competencies': 'showCompetencies'
    },


    // config handlers
    updateStudentSparkpoint: function(studentSparkpointId, target) {
        var me = this,
            competencySparkpointsStore = me.getCompetencySparkpointsStore(),
            studentSparkpoint = competencySparkpointsStore.findRecord('student_sparkpointid', studentSparkpointId),
            studentSparkpointIdArray = studentSparkpointId.split('_'),
            studentId = studentSparkpointIdArray[0],
            sparkpointId = studentSparkpointIdArray[1],
            existingSparkpoint;

        // If the studentSparkpoint doesn't exist, we need to piece together a new record from the data we have
        if (Ext.isEmpty(studentSparkpoint)) {
            existingSparkpoint = competencySparkpointsStore.findRecord('sparkpoint_id', sparkpointId);

            studentSparkpoint = competencySparkpointsStore.add({
                student_id: studentId,
                sparkpoint_id: sparkpointId,
                student_sparkpointid: studentSparkpointId,
                sparkpoint: existingSparkpoint.get('sparkpoint'),
                section_id: existingSparkpoint.get('section_id')
            })[0];
        }

        me.studentSparkpoint = studentSparkpoint;
        me.showByTarget = target;
        me.getApplication().fireEvent('studentsparkpointchange', studentSparkpoint, target);
    },

    updateActiveStudentId: function(studentId) {
        var me = this;

        me.activeStudentId = studentId;
        me.getApplication().fireEvent('activestudentidchange', studentId);
    },

    bindFilterActions: function() {
        var me = this,
            column = me.getSparkpointsColumn(),
            studentFilter = column.getStudentFilter(),
            sparkpointFilter = column.getSparkpointFilter(),
            gridStore = me.getCompetenciesGrid().getStore(),
            gridData = gridStore.getRange(),
            gridRowData,
            studentStore = me.getStudentsStore(),
            students = studentStore.getRange(),
            studentOptions = '',
            sparkpointOptions = '',
            student,
            count;

        if (!studentStore.isLoaded()) {
            studentStore.on('load', function() {
                me.bindFilterActions();
            }, { single: true });

            return;
        }

        if (!gridStore.isLoaded()) {
            gridStore.on('datachanged', function() {
                me.bindFilterActions();
            }, { single: true })
        }

        for (count = 0; count < students.length; count++) {
            student = students[count];
            studentOptions += '<option>' + student.get('FullName') + '</option>';
        }

        for (count = 0; count < gridData.length; count++) {
            gridRowData = gridData[count];
            sparkpointOptions += '<option>' + gridRowData.get('sparkpoint') + '</option>';
        }

        studentFilter.setHtml(studentOptions);
        sparkpointFilter.setHtml(sparkpointOptions);
    },

    // route handlers
    showCompetencies: function() {
        var me = this,
            tabsCt = me.getTabsCt();

        me.loadSectionGoals();

        me.doHighlightTabbars();

        tabsCt.removeAll();
        tabsCt.add(me.getCompetenciesCt());
    },


    // event handlers
    onNavCompetenciesTap: function() {
        this.redirectTo('competencies');
    },

    onCompetenciesCtActivate: function() {
        var me = this;

        me.getNavBar().setSelectedButton(me.getCompetenciesNavButton());
        me.refreshColumns();
    },

    onSparkConfigClick: function(dataIndex) {
        var me = this,
            rec = me.getStudentsStore().getById(dataIndex);

        me.updateActiveStudentId(rec.getId());
    },

    onSparkGoalClick: function(dataIndex, field) {
        this.currentDataIndex = dataIndex;
        this.currentGoalField = field;
        this.currentGoalValue = field.value;

        field.addEventListener('input', this.onSparkGoalInput.bind(this), false);
    },

    onSparkGoalInput: function() {
        var me = this,
            sectionGoal,
            filterFloat = function (value) {
                if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
                    return Number(value);
                }
                return NaN;
            };

        if (!me.currentDataIndex || !me.currentGoalField) {
            return;
        }

        // sectionGoal can either be null (empty field) or a positive integer
        sectionGoal = me.currentGoalField.value === '' ? null : filterFloat(me.currentGoalField.value);
        if (sectionGoal !== null && (!Ext.isNumber(sectionGoal) || sectionGoal < 0)) {
            me.currentGoalField.value = me.currentGoalValue;
            return;
        }

        me.saveSectionGoal(sectionGoal);
    },

    saveSectionGoal: Ext.Function.createBuffered(function(sectionGoal) {
        var me = this,
            sectionCode = me.getAppCt().getSelectedSection(),
            onFailure;

        onFailure = function(response) {
            // reset the field to old value and alert the user
            me.currentGoalField.value = me.currentGoalValue;

            Ext.Msg.alert('Error', response.statusText);
        };

        Slate.API.request({
            method: 'POST',
            url: '/spark/api/sparkpoints/section/goals',
            jsonData: [{
                student_id: me.currentDataIndex,
                section_code: sectionCode,
                goal: sectionGoal,
                term_id: 1 // TODO change this once the UI is aware of term_id
            }],
            failure: onFailure.bind(me)
        });
    }, 100),

    onCompetenciesGridItemTap: function(grid, index, row, rec, e) {
        var me = this,
            targetEl = Ext.fly(e.target),
            studentId = targetEl.getAttribute('data-student-id'),
            studentSparkpointId = studentId + '_' + rec.getId();

        if (targetEl.hasCls('pip-text')) {
            if (Ext.isEmpty(studentId)) {
                return;
            }

            me.updateStudentSparkpoint(studentSparkpointId, Ext.fly(e.target));
        }
    },

    onSelectedSectionChange: function(appCt, section, oldSection) {
        var me = this;

        if (section && section != oldSection) { // load all student sparkpoints when section changes -- will trigger repopulation of competency columns/data.
            me.getCompetencySparkpointsStore().load();
        }
    },

    onCompetencySparkpointsStoreUpdate: function(store, record, operation, modifiedFieldNames) {
        var me = this,
            competenciesGrid = me.getCompetenciesCt().down('spark-competencies-grid'),
            ignoreModifiedFields = ['student'], recordData = {}, gridRecord,
            student = Ext.getStore('Students').getById(record.get('student_id'));

        if (modifiedFieldNames && modifiedFieldNames.length === 1 && ignoreModifiedFields.indexOf(modifiedFieldNames[0]) !== -1 || !student) {
            return;
        }

        // update/add competencies grid store record
        gridRecord = competenciesGrid.getStore().getById(record.get('sparkpoint_id'));
        recordData[student.getId()] = record;
        recordData[student.get('Username')+'_completed_phase'] = record.get('completed_phase_number');

        if (gridRecord) {
            gridRecord.set(recordData, {
                dirty: false
            });
        } else {
            recordData.id = record.data.sparkpoint_id;
            recordData.sparkpoint = record.data.sparkpoint_code;

            competenciesGrid.getStore().add(recordData);
        }
    },

    onSocketData: function(socket, data) {
        var competencySparkpointsStore = this.getCompetencySparkpointsStore(),
            table = data.table,
            itemData = data.item,
            sparkpoint = competencySparkpointsStore.getById(itemData.student_id + '_' + itemData.sparkpoint_id);

        // update sparkpoint in student sparkpoints store
        if (table === 'student_sparkpoint') {
            if (sparkpoint) {
                sparkpoint.set(itemData, {
                    dirty: false
                });
            }
        } else if (table == 'section_student_active_sparkpoint') { // if no record exists for this sparkpoint, create one.
            if (Ext.isEmpty(competencySparkpointsStore.getById(itemData.student_id + '_' + itemData.sparkpoint_id))) {
                // create model, add neccessary data.
                itemData.student = Ext.getStore('Students').getById(itemData.student_id);
                itemData.student_sparkpointid = itemData.student_id + '_' + itemData.sparkpoint_id;
                competencySparkpointsStore.add(itemData);
            }
        }
    },

    // controller methods
    refreshColumns: function() {
        var me = this,
            studentStore = this.getStudentsStore(),
            sectionGoalsStore = me.getSectionGoalsStore(),
            bufferedRefreshColumns = me.bufferedRefreshColumns,
            grid = me.getCompetenciesGrid();

        if (!grid || !studentStore || !studentStore.isLoaded() || !sectionGoalsStore || !sectionGoalsStore.isLoaded()) {
            return;
        }

        if (!bufferedRefreshColumns) {
            bufferedRefreshColumns = me.bufferedRefreshColumns = Ext.Function.createBuffered(me.fireEventedAction, 10, me, ['refreshcolumns', [me], 'doRefreshColumns', me]);
        }

        bufferedRefreshColumns();
    },

    refreshGrid: function() {
        var me = this,
            competencySparkpointsStore = me.getCompetencySparkpointsStore(),
            bufferedRefreshGrid = me.bufferedRefreshGrid,
            grid = me.getCompetenciesGrid();

        if (!grid || !competencySparkpointsStore || !competencySparkpointsStore.isLoaded()) {
            return;
        }

        if (!bufferedRefreshGrid) {
            bufferedRefreshGrid = me.bufferedRefreshGrid = Ext.Function.createBuffered(me.fireEventedAction, 10, me, ['refreshgrid', [me], 'doRefreshGrid', me]);
        }

        bufferedRefreshGrid();
    },

    /**
     * @private
     * highlights proper section in the spark teacher tabbar
     */
    doHighlightTabbars: function() {
        var teacherTabbar = this.getTeacherTabbar(),
            teacherTab = teacherTabbar.down('#competencies');

        teacherTabbar.setActiveTab(teacherTab);
    },

    maskCompetenciesGrid: function(msg) {
        var grid = this.getCompetenciesGrid();

        if (grid) {
            grid.setMasked({
                xtype: 'loadmask',
                message: msg || 'Loading Competency Data'
            });
        }
    },

    loadSectionGoals: function() {
        var me = this,
            currentSection = me.getAppCt().getSelectedSection(),
            sectionGoalsStore = me.getSectionGoalsStore();

        sectionGoalsStore.getProxy().setExtraParams({
            section_id: currentSection
        });

        sectionGoalsStore.load();
    },

    /**
     * @private
     * populates comptencies grid based on CompetencySparkpoints store data.
     */
    doRefreshGrid: function() {
        var me = this,
            grid = me.getCompetenciesGrid(),
            studentSparkpointData = me.getCompetencySparkpointsStore().getRange(),
            studentStore = me.getStudentsStore(),
            gridDataIds = [],
            newRecords = [],
            gridStore = grid.getStore(),
            count = 0, studentId, student, record, recordData, sparkpointId, studentSparkpoint

        gridStore.beginUpdate();
        gridStore.removeAll();

        // add sparkpoints to grid store and link to respective StudentCompetency panel.
        for (; count < studentSparkpointData.length; count++) {
            studentSparkpoint = studentSparkpointData[count];
            sparkpointId = studentSparkpoint.get('sparkpoint_id');
            studentId = studentSparkpoint.get('student_id');
            student = studentStore.getById(studentId);
            record = null;
            recordData = {};

            // create record for each unique sparkpoint id
            if (gridDataIds.indexOf(sparkpointId) === -1) {
                record = {
                    'id': sparkpointId,
                    'sparkpoint': studentSparkpoint.get('sparkpoint')
                };

                if (student) {
                    record[studentId] = studentSparkpoint;
                }

                newRecords.push(record);
                gridDataIds.push(sparkpointId);
            } else {
                record = gridStore.getById(sparkpointId);
                if (record && student) {
                    recordData[studentId] = studentSparkpoint;

                    record.set(recordData, {
                        dirty: false,
                        silent: true
                    });
                }
            }
        }

        gridStore.add(newRecords);
        gridStore.endUpdate();
        grid.setMasked(false);
    },

    /**
     * @private
     * populates competencies grid columns with students associated with {SparkClassroomTeacher.view.AppContainer}
     */
    doRefreshColumns: function() {
        var me = this,
            grid = me.getCompetenciesGrid(),
            studentStore = me.getStudentsStore(),
            sectionGoalsStore = me.getSectionGoalsStore(),
            studentCompetencyColumnXType = 'spark-student-competency-column',
            currentSection = me.getAppCt().getSelectedSection(),
            studentRecs = studentStore.getRange(),
            count = 0, studentId, student, columns = [],
            goalRec, goalValue;

        grid.setCurrentSection(currentSection);
        grid.suspendEvents();

        Ext.each(grid.query(studentCompetencyColumnXType), function(column) {
            if (column && column.xtype === studentCompetencyColumnXType) {
                grid.remove(column);
            }
        });

        for (; count < studentRecs.length; count++) {
            student = studentRecs[count];
            studentId = student.getId();
            goalRec = sectionGoalsStore.findRecord('student_id', studentId);
            goalValue = '';

            // if it's null, leave goalValue as empty string
            if (goalRec && goalRec.get('goal') !== null) {
                goalValue = goalRec.get('goal');
            }

            columns.push({
                xtype: studentCompetencyColumnXType,
                dataIndex: studentId,
                text: [
                    '<div class="text-center">',
                    '<div class="student-name">', student.getFullName(), '</div>',
                    '<div class="field auto-width">',
                    '<label class="field-label">Q4 Goal</label>',
                    '<input class="spark-goal field-control tiny" value="' + goalValue + '"/>',
                    '<button type="button" class="plain"><i class="spark-config-btn fa fa-lg fa-wrench"></i></button>',
                    '</div>',
                    '</div>'
                ].join(' ')
            });
        }

        grid.resumeEvents();
        grid.addColumn(columns);
    }
});