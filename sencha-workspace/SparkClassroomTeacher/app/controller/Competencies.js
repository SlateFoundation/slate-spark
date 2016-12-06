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
    requires: [
        /* global Slate */
        'Slate.API'
    ],


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
        showByTarget: null
    },

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

        addToQueuePopover: {
            selector: 'spark-addtoqueue-popover',
            autoCreate: true,
            xtype: 'spark-addtoqueue-popover'
        },

        addToQueueBtn: 'spark-addtoqueue-popover button[cls~=spark-add-to-queue-btn]',
        addNextUpBtn: 'spark-addtoqueue-popover button[cls~=spark-add-next-up-btn]',
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
            initialize: 'onInitializeCompetenciesGrid',
            activate: 'refreshColumns',
            itemtap: 'onCompetenciesGridItemTap'
        },

        addToQueueBtn: {
            tap: 'onAddToQueue'
        },

        addNextUpBtn: {
            tap: 'onAddNextUp'
        },

        'spark-student-competency-column': {
            sparkconfigclick: {
                fn: 'onSparkConfigClick'
            },
            sparkgoalclick: {
                fn: 'onSparkGoalClick'
            }
        },

        addToQueuePopover: {
            hide: {
                fn: 'onAddToQueueHide'
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
                load: 'onStudentStoreLoad'
            },
            '#SectionGoals': {
                load: 'onSectionGoalsStoreLoad'
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
    updateStudentSparkpoint: function(studentSparkpointId, target, column) {
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
                'student_id': studentId,
                'sparkpoint_id': sparkpointId,
                'student_sparkpointid': studentSparkpointId,
                sparkpoint: existingSparkpoint.get('sparkpoint'),
                'section_id': existingSparkpoint.get('section_id')
            })[0];
        }

        me.studentSparkpoint = studentSparkpoint;
        me.showByTarget = target;
        me.getApplication().fireEvent('studentsparkpointchange', studentSparkpoint, target, column);
    },

    updateActiveStudentId: function(studentId) {
        var me = this;

        me.activeStudentId = studentId;
        me.getApplication().fireEvent('activestudentidchange', studentId);
    },

    // route handlers
    showCompetencies: function() {
        var me = this,
            tabsCt = me.getTabsCt();

        if (!me.getSectionGoalsStore().isLoaded()) {
            me.loadSectionGoals();
        }

        me.doHighlightTabbars();

        tabsCt.removeAll();
        tabsCt.add(me.getCompetenciesCt());
    },

    // event handlers
    onAddToQueue: function() {
        this.addToQueue(false);
    },

    onAddNextUp: function() {
        this.addToQueue(true);
    },

    onInitializeCompetenciesGrid: function(grid) {
        // Bind filter actions
        var me = this,
            column = me.getSparkpointsColumn(),
            studentFilter = column.getStudentFilter(),
            sparkpointFilter = column.getSparkpointFilter();

        studentFilter.on('change', function(e, t) {
            me.onFilterByStudent(e, t);
        });

        sparkpointFilter.on('change', function(e, t) {
            me.onFilterBySparkpoint(e, t);
        });

        grid.getStore().on('endupdate', function() {
            me.refreshSparkpointFilter(grid);
        });

        me.refreshSparkpointFilter(grid);
    },

    onFilterByStudent: function(e, target) {
        var me = this,
            valueString = Ext.get(target).getValue(),
            studentId = parseInt(valueString, 10),
            grid = me.getCompetenciesGrid(),
            columns = grid.getColumns(),
            column,
            dataIndex,
            count;

        for (count = 0; count < columns.length; count++) {
            column = columns[count];
            dataIndex = column.getDataIndex();

            if (dataIndex === 'sparkpoint' || dataIndex === studentId || valueString === 'all') {
                column.show();
                continue;
            }

            column.hide();
        }
    },

    onFilterBySparkpoint: function(e, target) {
        var me = this,
            sparkpointId = Ext.get(target).getValue(),
            grid = me.getCompetenciesGrid(),
            gridStore = grid.getStore();


        if (sparkpointId !== 'all') {
            gridStore.clearFilter();
            gridStore.filter('id', sparkpointId);
            return;
        }

        gridStore.clearFilter();
    },

    onStudentStoreLoad: function() {
        this.refreshColumns(true);
    },

    onSectionGoalsStoreLoad: function() {
        this.refreshColumns(true);
    },

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

    onAddToQueueHide: function() {
        Ext.select('.is-stuck').each(function() {
            this.removeCls('is-stuck');
        });
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
                'student_id': me.currentDataIndex,
                'section_code': sectionCode,
                goal: sectionGoal,
                'term_id': 1 // TODO change this once the UI is aware of term_id
            }],
            failure: onFailure.bind(me)
        });
    }, 100),

    onCompetenciesGridItemTap: function(grid, index, row, rec, e) {
        var me = this,
            targetEl = Ext.fly(e.target),
            studentId,
            studentSparkpointId;

        if (targetEl.hasCls('cycle-gauge-pip')) {
            targetEl = targetEl.down('.pip-text');
        }

        if (targetEl.hasCls('pip-text')) {
            studentId = targetEl.getAttribute('data-student-id');
            studentSparkpointId = studentId + '_' + rec.getId();

            if (Ext.isEmpty(studentId)) {
                return;
            }

            me.updateStudentSparkpoint(studentSparkpointId, targetEl);
        }

        if (targetEl.getAttribute('action') === 'add-to-queue') {
            me.onToggleQueuePopover(targetEl, e);
        }
    },

    onToggleQueuePopover: function(el, e) {
        var cellDom = e.getTarget('.x-grid-cell'),
            addToQueuePopover = this.getAddToQueuePopover(),
            sparkpoint = Ext.get(cellDom).down('.spark-column-value').getHtml();

        addToQueuePopover.showBy(el, 'cl-cr?');
        addToQueuePopover.setSparkpoint(sparkpoint);
    },

    onSelectedSectionChange: function(appCt, section, oldSection) {
        var me = this;

        if (section && section !== oldSection) { // load all student sparkpoints when section changes -- will trigger repopulation of competency columns/data.
            me.getCompetencySparkpointsStore().load();
        }
    },

    onCompetencySparkpointsStoreUpdate: function(store, record, operation, modifiedFieldNames) {
        var me = this,
            competenciesGrid = me.getCompetenciesGrid(),
            ignoreModifiedFields = ['student'], recordData = {}, gridRecord,
            student = Ext.getStore('Students').getById(record.get('student_id'));

        if (modifiedFieldNames && modifiedFieldNames.length === 1 && ignoreModifiedFields.indexOf(modifiedFieldNames[0]) !== -1 || !student) {
            return;
        }

        // update/add competencies grid store record
        if (competenciesGrid) {
            gridRecord = competenciesGrid.getStore().getById(record.get('sparkpoint_id'));
        }
        recordData[student.getId()] = record;
        recordData[student.get('Username')+'_completed_phase'] = record.get('completed_phase_number');

        if (gridRecord) {
            gridRecord.set(recordData, {
                dirty: false
            });
        } else {
            recordData.id = record.data.sparkpoint_id;
            recordData.sparkpoint = record.data.sparkpoint_code;

            if (competenciesGrid) {
                competenciesGrid.getStore().add(recordData);
            }
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
        } else if (table === 'section_student_active_sparkpoint') {
            if (sparkpoint) {
                sparkpoint.set(itemData, {
                    dirty: false
                });
            } else {
                // create model, add neccessary data.
                itemData.student = Ext.getStore('Students').getById(itemData.student_id);
                itemData.student_sparkpointid = itemData.student_id + '_' + itemData.sparkpoint_id; // eslint-disable-line camelcase
                competencySparkpointsStore.add(itemData);
            }
        }
    },

    // controller methods
    refreshStudentFilter: function() {
        var me = this,
            column = me.getSparkpointsColumn(),
            studentFilter = column.getStudentFilter(),
            oldValue = studentFilter.getValue(),
            studentStore = me.getStudentsStore(),
            students = studentStore.getRange(),
            studentOptions = '',
            student,
            count;

        studentOptions += '<option value="all"' + (oldValue === 'all' ? ' selected' : '') + '>All Students</option>';

        for (count = 0; count < students.length; count++) {
            student = students[count];
            studentOptions += '<option value="' + student.getId() + '"' + (parseInt(oldValue, 10) === student.getId() ? ' selected' : '') + '>' + student.get('FullName') + '</option>';
        }

        studentFilter.setHtml(studentOptions);
    },

    refreshSparkpointFilter: function(grid) {
        var me = this,
            column = me.getSparkpointsColumn(),
            sparkpointFilter = column.getSparkpointFilter(),
            oldValue = sparkpointFilter.getValue(),
            gridStore = grid.getStore(),
            gridData = gridStore.isFiltered() ? gridStore.getData().getSource().getRange() : gridStore.getRange(), // returns unfiltered data for building these options
            gridRowData,
            sparkpointOptions = '',
            count;

        // Sort sparkpoint records alphabetically for easier selection
        gridData = Ext.Array.sort(gridData, function(a, b) {
            var spark1 = a.get('sparkpoint'),
                spark2 = b.get('sparkpoint');

            return spark1 < spark2 ? -1 : 1;
        });

        sparkpointOptions += '<option value="all"' + (oldValue === 'all' ? ' selected' : '') + '>All Sparkpoints</option>';

        for (count = 0; count < gridData.length; count++) {
            gridRowData = gridData[count];
            sparkpointOptions += '<option value="' + gridRowData.getId() + '"' + (oldValue === gridRowData.getId() ? ' selected' : '') + '>' + gridRowData.get('sparkpoint') + '</option>';
        }

        sparkpointFilter.setHtml(sparkpointOptions);
    },

    // This method ensures that all pre-requisites of doRefreshColumns are satisfied before it is called,
    // and throttles the call using a bufferedFunction. DO NOT handle checking pre-requisites outside of this function
    refreshColumns: function(force) {
        var me = this,
            studentStore = this.getStudentsStore(),
            sectionGoalsStore = me.getSectionGoalsStore(),
            bufferedRefreshColumns = me.bufferedRefreshColumns,
            grid = me.getCompetenciesGrid();

        if (!grid || !studentStore || !studentStore.isLoaded() || !sectionGoalsStore || !sectionGoalsStore.isLoaded()) {
            return;
        }

        // if force is true, refresh the columns even if they are already rendered
        if (!force && grid.query('spark-student-competency-column').length > 0) {
            return;
        }

        if (!bufferedRefreshColumns) {
            bufferedRefreshColumns = me.bufferedRefreshColumns = Ext.Function.createBuffered(me.fireEventedAction, 10, me, ['refreshcolumns', [me], 'doRefreshColumns', me]);
        }

        bufferedRefreshColumns();
    },

    // This method ensures that all pre-requisites of doRefreshGrid are satisfied before it is called,
    // and throttles the call using a bufferedFunction DO NOT handle checking pre-requisites outside of this function
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
            'section_id': currentSection
        });

        sectionGoalsStore.load();
    },

    addToQueue: function(nextUp) {
        var me = this,
            sparkpoint = me.getAddToQueuePopover().getSparkpoint(),
            studentStore = me.getStudentsStore(),
            students = studentStore.getRange(),
            section = me.getAppCt().getSelectedSection(),
            count,
            studentId,
            newStudentSparkpoints = [],
            recommendedTime;

        for (count = 0; count < students.length; count++) {
            studentId = students[count].getId();

            recommendedTime = nextUp ? me.getNextUpTime(studentId) : new Date();

            newStudentSparkpoints.push({
                'student_id': studentId,
                'section_code': section,
                'sparkpoint_code': sparkpoint,
                'recommended_time': recommendedTime.getTime() // send as UTC timestamp
            });
        }

        if (newStudentSparkpoints.length === 0) {
            Ext.Msg.alert('Already Recommended', 'This sparkpoint is already either in queue or active for all students.');
            return;
        }

        Slate.API.request({
            method: 'POST',
            url: '/spark/api/sparkpoints/suggest',
            jsonData: newStudentSparkpoints,
            callback: function(options, success) {
                this.getAddToQueuePopover().hide();

                if (!success) {
                    Ext.Msg.alert('Error Adding to Queue', 'This sparkpoint could not be recommended, please try again or contact an administrator');
                }
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
            newRecords = [],
            recordDictionary = {},
            record,
            gridStore = grid.getStore(),
            count = 0, studentId, student, sparkpointId, studentSparkpoint;

        gridStore.beginUpdate();
        gridStore.removeAll();

        // add sparkpoints to grid store and link to respective StudentCompetency panel.
        for (; count < studentSparkpointData.length; count++) {
            studentSparkpoint = studentSparkpointData[count];
            sparkpointId = studentSparkpoint.get('sparkpoint_id');
            studentId = studentSparkpoint.get('student_id');
            student = studentStore.getById(studentId);

            // create record for each unique sparkpoint id
            if (recordDictionary[sparkpointId] && student) {
                recordDictionary[sparkpointId][studentId] = studentSparkpoint;
            } else if (student) {
                recordDictionary[sparkpointId] = {
                    id: sparkpointId,
                    sparkpoint: studentSparkpoint.get('sparkpoint')
                };

                recordDictionary[sparkpointId][studentId] = studentSparkpoint;
            }
        }

        for (record in recordDictionary) {
            if ({}.hasOwnProperty.call(recordDictionary, record)) {
                newRecords.push(recordDictionary[record]);
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
            currentSection = me.getAppCt().getSelectedSection(),
            studentRecs = studentStore.getRange(),
            count = 0, studentId, student, columns = [],
            goalRec, goalValue;

        grid.setCurrentSection(currentSection);
        me.refreshStudentFilter();

        Ext.each(grid.query('spark-student-competency-column'), function(column) {
            if (column && column.xtype === 'spark-student-competency-column') {
                grid.removeColumn(column);
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
                xtype: 'spark-student-competency-column',
                dataIndex: studentId,
                text: [
                    '<div class="text-center">',
                    '<div class="student-name">', student.getFullName(), '</div>',
                    '<div class="field auto-width">',
                    '<label class="field-label">RP Goal</label>',
                    '<input class="spark-goal field-control tiny" value="' + goalValue + '"/>',
                    '<button type="button" class="plain"><i class="spark-config-btn fa fa-lg fa-wrench"></i></button>',
                    '</div>',
                    '</div>'
                ].join(' ')
            });
        }

        grid.addColumn(columns);
        me.refreshGrid();
    }
});
