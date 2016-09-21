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


    views: [
        'competencies.Container'
    ],

    stores: [
        'CompetencySparkpoints@SparkClassroomTeacher.store',
        'Students@SparkClassroom.store'
    ],

    refs: {
        navBar: 'spark-navbar',
        competenciesNavButton: 'spark-navbar button#competencies',
        tabsCt: 'spark-teacher-tabscontainer',
        teacherTabbar: 'spark-teacher-tabbar',

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
    updateStudentSparkpoint: function(sparkpoint, target) {
        var me = this;

        me.studentSparkpoint = sparkpoint;
        me.showByTarget = target;
        me.getApplication().fireEvent('studentsparkpointchange', sparkpoint, target);
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
            rec = me.getStudentsStore().findRecord('Username', dataIndex);

        me.updateActiveStudentId(rec.getId());
    },

    onCompetenciesGridItemTap: function(grid, index, row, rec, e) {
        var me = this,
            targetEl = Ext.fly(e.target),
            competencySparkpointsStore = me.getCompetencySparkpointsStore(),
            studentId = targetEl.getAttribute('data-student-id'),
            studentSparkpointId = rec.getData().id,
            studentSparkPoint = competencySparkpointsStore.findRecord('student_sparkpointid', studentSparkpointId);

        if (targetEl.hasCls('pip-text')) {
            if (Ext.isEmpty(studentId)) {
                return;
            }

            me.updateStudentSparkpoint(studentSparkPoint, Ext.fly(e.target));
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
        recordData[student.get('Username')] = record;
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
            bufferedRefreshColumns = me.bufferedRefreshColumns,
            grid = me.getCompetenciesGrid();

        if (!grid || !studentStore || !studentStore.isLoaded()) {
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
            gridStore = grid.getStore(),
            count = 0, studentId, student, record, recordData, sparkpointId, studentSparkpoint;

        gridStore.removeAll();

        // add sparkpoints to grid store and link to respective StudentCompetency panel.
        for (; count < studentSparkpointData.length; count++) {
            studentSparkpoint = studentSparkpointData[count];
            sparkpointId = studentSparkpoint.get('sparkpoint_id');
            studentId = studentSparkpoint.get('student_id');
            student = studentStore.getById(studentId);
            recordData = {};

            // create record for each unique sparkpoint id
            if (gridDataIds.indexOf(sparkpointId) === -1) {
                record = gridStore.add({
                    'id': sparkpointId,
                    'sparkpoint': studentSparkpoint.get('sparkpoint')
                })[0];
                gridDataIds.push(sparkpointId);
            } else {
                record = gridStore.getById(sparkpointId);
            }

            if (record && student) {
                recordData[student.get('Username')] = studentSparkpoint;

                record.set(recordData, { dirty: false });
            }
        }

        grid.setMasked(false);
    },

    /**
     * @private
     * populates competencies grid columns with students associated with {SparkClassroomTeacher.view.AppContainer}
     */
    doRefreshColumns: function() {
        var me = this,
            grid = me.getCompetenciesGrid(),
            studentStore = Ext.getStore('Students'),
            studentCompetencyColumnXType = 'spark-student-competency-column',
            currentSection = me.getAppCt().getSelectedSection(),
            studentRecs = studentStore.getData().items,
            count = 0, studentUsername, student, columns = [];

        grid.setCurrentSection(currentSection);

        Ext.each(grid.query(studentCompetencyColumnXType), function(column) {
            if (column && column.xtype === studentCompetencyColumnXType) {
                column.destroy();
            }
        });

        for (; count < studentRecs.length; count++) {
            student = studentRecs[count];
            studentUsername = student.get('Username');
            columns.push({
                xtype: studentCompetencyColumnXType,
                dataIndex: studentUsername,
                text: [
                    '<div class="text-center">',
                    '<div class="student-name">', student.getFullName(), '</div>',
                    '<div class="field auto-width">',
                    '<label class="field-label">Q4 Goal</label>',
                    '<select class="field-control tiny"><option>20</option></select>',
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