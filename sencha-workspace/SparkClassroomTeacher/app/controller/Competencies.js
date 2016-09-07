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
        'Activities@SparkClassroom.store',
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
            activate: {
                fn: 'onCompetenciesGridActivate',
                buffer: 100
            },
            itemtap: {
                fn: 'onCompetenciesGridItemTap'
            }
        }
    },

    listen: {
        store: {
            '#Activities': {
                update: 'onActivitiesStoreUpdate'
            },
            '#Students': {
                beforeload: 'onBeforeStudentStoreLoad',
                load: {
                    fn: 'onStudentsStoreLoad',
                    buffer: 100
                }
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
        this.getNavBar().setSelectedButton(this.getCompetenciesNavButton());
    },

    onCompetenciesGridActivate: function() {
        var me = this;

        me.maskCompetenciesGrid();
        me.populateCompetencyColumns();
    },

    onCompetenciesGridItemTap: function(grid, index, row, rec, e) {
        var me = this,
            targetEl = Ext.fly(e.target),
            activityStore = me.getActivitiesStore(),
            studentId = targetEl.getAttribute('data-student-id'),
            studentSparkpointId = studentId + '_' + rec.getData().id,
            studentSparkPoint = activityStore.findRecord('student_sparkpointid', studentSparkpointId);
            
        if (targetEl.hasCls('pip-text')) {
            if (Ext.isEmpty(studentId)) {
                return;
            }

            me.updateStudentSparkpoint(studentSparkPoint, Ext.fly(e.target));
        }
    },

    onSelectedSectionChange: function(appCt, section, oldSection) {
        var me = this;

        if (section && section != oldSection) { // load all activities when section changes -- will trigger repopulation of competency columns/data.
            me.getActivitiesStore().load();
        }
    },

    onActivitiesStoreUpdate: function(store, record, operation, modifiedFieldNames) {
        var me = this,
            competenciesGrid = me.getCompetenciesCt().down('spark-competencies-grid'),
            ignoreModifiedFields = ['student'], student, recordData = {}, gridRecord;

        // ignore modifications to only the student field.
        if ((modifiedFieldNames && modifiedFieldNames.length === 1 && ignoreModifiedFields.indexOf(modifiedFieldNames[0]) !== -1) || !(student = record.get('student'))) {
            return;
        }

        // update competencies grid store
        gridRecord = competenciesGrid.getStore().getById(record.get('sparkpoint_id'));

        if (gridRecord) {
            recordData[student.get('Username')] = record;

            recordData[student.get('Username')+'_completed_phase'] = record.get('completed_phase_number');

            gridRecord.set(recordData, {
                dirty: false
            });
        }
    },

    onBeforeStudentStoreLoad: function() {
        this.maskCompetenciesGrid();
    },

    onStudentsStoreLoad: function() {
        this.populateCompetencyColumns();
    },

    onSocketData: function(socket, data) {
        var activityStore = this.getActivitiesStore(),
            table = data.table,
            itemData = data.item,
            sparkpoint = activityStore.getById(itemData.student_id + '_' + itemData.sparkpoint_id);

        // update sparkpoint in activities store
        if (table === 'student_sparkpoint') {
            if (sparkpoint) {
                sparkpoint.set(itemData, {
                    dirty: false
                });
            }
        } else if (table == 'section_student_active_sparkpoint') { // if no activity exists for this sparkpoint, create one.
            if (Ext.isEmpty(activityStore.getById(itemData.student_id + '_' + itemData.sparkpoint_id))) {
                // create model, add neccessary data.
                itemData.student = Ext.getStore('Students').getById(itemData.student_id);
                activityStore.add(itemData);
            }
        }
    },


    // controller methods
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
     * populates comptencies grid based on activity store data.
     */
    populateCompetenciesGrid: function() {
        var me = this,
            grid = me.getCompetenciesGrid(),
            activityStore = Ext.getStore('Activities'),
            activityData = activityStore.getRange(),
            studentStore = Ext.getStore('Students'),
            gridDataIds = [],
            gridStore,
            count = 0, studentId, student, record, recordData, sparkpointId, studentSparkpoint;

        if (Ext.isEmpty(grid)) {
            return;
        }

        gridStore = grid.getStore();

        // check if activities are done loading, if not wait for that to happen.
        if (activityStore.isLoading()) {
            activityStore.on('load', function() {
                me.populateCompetenciesGrid();
            }, null, { single: true });

            return;
        }

        if (!activityStore.isLoaded()) {
            activityStore.load(function() {
                me.populateCompetenciesGrid();
            });

            return;
        }

        gridStore.removeAll();

        // add sparkpoints to grid store and link to respective StudentCompetency panel.
        for (; count < activityData.length; count++) {
            studentSparkpoint = activityData[count];
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

    populateCompetencyColumns: function() {
        var me = this,
            grid = me.getCompetenciesGrid(),
            studentStore = Ext.getStore('Students'),
            studentCompetencyColumnXType = 'spark-student-competency-column',
            currentSection = me.getAppCt().getSelectedSection(),
            studentRecs = studentStore.getData().items,
            sparkConfigCallback,
            count = 0, studentUsername, student, columns = [];

        // grid has not rendered yet, return. this method will be called again when the grid is activated.
        if (!grid || !grid.rendered) {
            return;
        }

        // make sure students are loaded first
        if (studentStore.isLoading()) {
            studentStore.on('load', function() {
                return me.populateCompetenciesGrid();
            }, null, { single: true });

            return
        }

        if (!studentStore.isLoaded()) {
            studentStore.load(function() {
                return me.populateCompetenciesGrid();
            });

            return;
        }

        if (grid.getCurrentSection() == currentSection) {
            return;
        }

        grid.setCurrentSection(currentSection);

        Ext.each(grid.query(studentCompetencyColumnXType), function(column) {
            if (column && column.xtype === studentCompetencyColumnXType) {
                column.destroy();
            }
        });

        sparkConfigCallback = function() {
            // this is represented by the column
            me.showSparkpointsConfig(studentStore.findRecord('Username', this.getDataIndex()).getId());
        };

        for (; count < studentRecs.length; count++) {
            student = studentRecs[count];
            studentUsername = student.get('Username');
            columns.push({
                xtype: studentCompetencyColumnXType,
                dataIndex: studentUsername,

                listeners: {
                    click: {
                        element: 'element',
                        delegate: '.fa-wrench',
                        fn: sparkConfigCallback
                    }
                },

                text: [
                    '<div class="text-center">',
                    '<div class="student-name">', student.getFullName(), '</div>',
                    '<div class="field auto-width">',
                    '<label class="field-label">Q4 Goal</label>',
                    '<select class="field-control tiny"><option>20</option></select>',
                    '<button type="button" class="plain"><i class="fa fa-lg fa-wrench"></i></button>',
                    '</div>',
                    '</div>'
                ].join(' ')
            });
        }

        grid.addColumn(columns);
        grid.setMasked(false);
        me.populateCompetenciesGrid();
    },

    showSparkpointsConfig: function(studentId) {
        this.updateActiveStudentId(studentId);
    }
});