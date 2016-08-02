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
        'SparkClassroomTeacher.app.competencies.column.panel.StudentCompetency'
    ],

    views: [
        'competencies.Container'
    ],

    stores: [
        'Activities@SparkClassroom.store'
    ],

    refs:{
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

        competenciesGrid: 'spark-competencies spark-competencies-grid'
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
            "#Activities": {
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


    // route handlers
    showCompetencies: function() {
        var tabsCt = this.getTabsCt();

        this.doHighlightTabbars();

        tabsCt.removeAll();
        tabsCt.add(this.getCompetenciesCt());
    },


    // event handlers
    onNavCompetenciesTap: function() {
        this.redirectTo('competencies');
    },

    onCompetenciesCtActivate: function() {
        this.getNavBar().setSelectedButton(this.getCompetenciesNavButton());
    },

    onCompetenciesGridActivate: function(grid) {
        this.maskCompetenciesGrid();
        this.populateCompetencyColumns();
    },

    onCompetenciesGridItemTap: function(grid, index, row, rec, e) {
        Ext.select('.spark-studentcompetency-popover').each(function() {
            this.destroy();
        });

        var compPanel = Ext.create('SparkClassroomTeacher.app.competencies.column.panel.StudentCompetency', {
            dataIndex: rec.getData().id
        });

        compPanel.showBy(Ext.fly(e.target), 'tc-cc?');
    },

    onSelectedSectionChange: function(appCt, section, oldSection) {
        var me = this;
        if (section && section != oldSection) { //load all activities when section changes -- will trigger repopulation of competency columns/data.
            me.getActivitiesStore().load();
        }
    },

    onActivitiesStoreUpdate: function(store, record, operation, modifiedFieldNames, details) {
        var me = this,
            competenciesGrid = me.getCompetenciesCt().down('spark-competencies-grid'),
            ignoreModifiedFields = ['student'], student, recordData = {}, gridRecord;

        //ignore modifications to only the student field.
        if (
            (modifiedFieldNames.length === 1 && ignoreModifiedFields.indexOf(modifiedFieldNames[0]) !== -1) ||
            (!(student = record.get('student')))
        ) {
            return;
        }

        //update competencies grid store
        if ((gridRecord = competenciesGrid.getStore().getById(record.get('sparkpoint_id')))) {
            recordData[student.get('Username')] = {
                learn_finish_time: record.get('learn_finish_time'),
                conference_finish_time: record.get('conference_finish_time'),
                apply_finish_time: record.get('apply_finish_time'),
                assess_finish_time: record.get('assess_finish_time')

            };
            recordData[student.get('Username')+'_completed_phase'] = SparkClassroom.model.StudentSparkpoint.prototype.fieldsMap.completed_phase_numerical.convert(null, record);

            gridRecord.set(recordData, {dirty: false});
        }
    },

    onBeforeStudentStoreLoad: function() {
        this.maskCompetenciesGrid();
    },

    onStudentsStoreLoad: function() {
        this.populateCompetencyColumns();
    },

    onSocketData: function(socket, data) {
        var me = this,
            activityStore = Ext.getStore('Activities'),
            table = data.table,
            itemData = data.item,
            sparkpointId, sparkpoint,
            updatedFields;

        //update sparkpoint in activities store
        if (table == 'student_sparkpoint') {
            if (
                (sparkpoint = activityStore.getById(itemData.student_id + '_' + itemData.sparkpoint_id))
            ) {
                sparkpoint.set(itemData, {dirty: false});
            }
        } else if (table == 'section_student_active_sparkpoint') { //if no activity exists for this sparkpoint, create one.
            if (
                !(sparkpoint = activityStore.getById(itemData.student_id + '_' + itemData.sparkpoint_id))
            ) {
                //create model, add neccessary data.
                sparkpoint = activityStore.add({
                    student: Ext.getStore('Students').getById(itemData.student_id),
                    student_id: itemData.student_id,
                    sparkpoint_id: itemData.sparkpoint_id,
                    student_sparkpointid: itemData.student_id + '_' + itemData.sparkpoint_id, // TODO: REMOVE?
                    section_id: itemData.section_id,
                    section_code: itemData.section_code,
                    learn_override_time: itemData.learn_override_time,
                    learn_override_teacher_id: itemData.learn_override_teacher_id,
                    conference_override_time: itemData.conference_override_time,
                    conference_override_teacher_id: itemData.conference_override_teacher_id,
                    apply_override_time: itemData.apply_override_time,
                    apply_override_teacher_id: itemData.apply_override_teacher_id,
                    assess_override_time: itemData.assess_override_time,
                    assess_override_teacher_id: itemData.assess_override_teacher_id,
                    override_reason: itemData.override_reason
                })[0];
            }
        }
    },


    // controller methods
    /**
     * @private
     * highlights proper section in the spark teacher tabbar
     */
    doHighlightTabbars: function(section) {
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
            studentStore = Ext.getStore('Students'),
            uniqueSparkpointIds = [],
            gridData = [], gridDataIds = [],
            groupedSparkpoints = {},
            gridStore,
            currentSection = me.getAppCt().getSelectedSection();

        if (!grid) {
            return;
        } else {
            gridStore = grid.getStore();
        }

        //check if activities are done loading, if not wait for that to happen.
        if (activityStore.isLoading()) {
            return activityStore.on('load', function() {
                return me.populateCompetenciesGrid();
            }, null, {single: true});
        } else if (!activityStore.isLoaded()) {
            return activityStore.load(function() {
                return me.populateCompetenciesGrid();
            });
        }

        gridStore.removeAll();

        // add sparkpoints to grid store and link to respective StudentCompetency panel.
        Ext.each(activityStore.getRange(), function(studentSparkpoint) {
            var sparkpointId = studentSparkpoint.get('sparkpoint_id'),
                studentId = studentSparkpoint.get('student_id'),
                student = studentStore.getById(studentId),
                record, recordData = {};

            //create record for each unique sparkpoint id
            if (gridDataIds.indexOf(sparkpointId) === -1) {
                record = gridStore.add({
                    id: sparkpointId,
                    sparkpoint: studentSparkpoint.get('sparkpoint')
                })[0];
                gridDataIds.push(sparkpointId);
            } else {
                record = gridStore.getById(sparkpointId);
            }


            if (record && student) {
                recordData[student.get('Username')] = {
                    learn_finish_time: studentSparkpoint.get('learn_finish_time'),
                    conference_finish_time: studentSparkpoint.get('conference_finish_time'),
                    apply_finish_time: studentSparkpoint.get('apply_finish_time'),
                    assess_finish_time: studentSparkpoint.get('assess_finish_time'),
                    learn_override_time: studentSparkpoint.get('learn_override_time'),
                    learn_override_teacher_id: studentSparkpoint.get('learn_override_teacher_id'),
                    conference_override_time: studentSparkpoint.get('conference_override_time'),
                    conference_override_teacher_id: studentSparkpoint.get('conference_override_teacher_id'),
                    assess_override_time: studentSparkpoint.get('assess_override_time'),
                    assess_override_teacher_id: studentSparkpoint.get('assess_override_teacher_id'),
                    override_reason: studentSparkpoint.get('override_reason')
                };

                recordData[student.get('Username')+'_completed_phase'] = studentSparkpoint.get('completed_phase_numerical');

                record.set(recordData, {dirty: false});
            }
        }, me);

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
            currentSection = me.getAppCt().getSelectedSection();

        //grid has not rendered yet, return. this method will be called again when the grid is activated.
        if (!grid || !grid.rendered) {
            return;
        }

        //make sure students are loaded first
        if (studentStore.isLoading()) {
            return studentStore.on('load', function() {
                return me.populateCompetenciesGrid();
            }, null, {single: true});
        } else if (!studentStore.isLoaded()) {
            return studentStore.load(function() {
                return me.populateCompetenciesGrid();
            });
        }

        if (grid.getCurrentSection() == currentSection) {
            return;
        } else {
            grid.setCurrentSection(currentSection);
        }

        Ext.each(grid.query(studentCompetencyColumnXType), function(column) {
            if (column && column.xtype == studentCompetencyColumnXType) {
                column.destroy();
            }
        });

        grid.suspendEvents();

        Ext.each(studentStore.getData().items, function(student) {
            grid.addColumn({
                xtype: studentCompetencyColumnXType,
                dataIndex: student.get('Username')+'_completed_phase',

                listeners: {
                    click: {
                        element: 'element',
                        delegate: '.fa-wrench',
                        fn: function(ev, t) {
                            Ext.create('SparkClassroom.column.panel.SparkpointsConfig').show();
                        }
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
        });

        grid.setMasked(false);
        grid.resumeEvents();

        me.populateCompetenciesGrid();

    }
});