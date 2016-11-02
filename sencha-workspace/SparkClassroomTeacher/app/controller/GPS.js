/**
 * The GPS controller manages the GPS section of the teacher interface that shows what phase
 * every student in the selected section is in and provides for selection of students.
 *
 * ## Responsibilities
 * - **(bug workaround)** {@link #method-workaroundRefreshLists Force refresh} on GPS lists when data changes
 * - Track selected student and fire {@link SparkClassroomTeacher.Application#event-activestudentselect activestudentselect application event}
 */
Ext.define('SparkClassroomTeacher.controller.GPS', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.proxy.API',
        'Ext.util.DelayedTask',
        'SparkClassroom.data.field.SparkDate'
    ],


    stores: [
        'StudentSparkpoints',

        'gps.Learn',
        'gps.Conference',
        'gps.Apply',
        'gps.Assess'
    ],

    listen: {
        store: {
            '#Students': {
                load: 'onStudentsStoreLoad'
            },
            '#StudentSparkpoints': {
                update: 'onStudentSparkpointsUpdate',
                endupdate: 'onStudentSparkpointsStoreEndUpdate'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    refs: {
        appCt: 'spark-teacher-appct',
        gpsCt: 'spark-gps',
        phaseMoveCombo: 'spark-gps selectfield[name=phaseMoveCombo]',
        assignSparkpointField: 'spark-gps spark-sparkpointfield'
    },

    control: {
        appCt: {
            selectedstudentsparkpointchange: 'onSelectedStudentSparkpointChange',
            togglestudentmultiselect: 'onToggleStudentMultiselect',

        },
        'spark-gps-studentlist': {
            itemtap: 'onListSelectChange' // itemtap is used to isolate the individual student being selected
        },
        phaseMoveCombo: {
            change: 'onPhaseMoveChange'
        },
        assignSparkpointField: {
            sparkpointselect: 'onAssignSparkpointSelect'
        }
    },


    // controller templates methods
    init: function() {
        var me = this;

        me.workaroundRefreshQueue = [];
        me.workaroundListCache = {};
        me.workaroundRefreshListsTask = new Ext.util.DelayedTask(me.workaroundRefreshLists, me);
    },


    // event handlers
    onSelectedStudentSparkpointChange: function() {
        this.syncSelectedStudentSparkpoint();
    },

    onStudentsStoreLoad: function(studentsStore, students, success) {
        var me = this;

        if (!success) {
            return;
        }

        me.getStudentSparkpointsStore().load();
    },

    onStudentSparkpointsUpdate: function(store, selectedStudentSparkpoint, operation, modifiedFieldNames) {
        var me = this,
            workaroundRefreshQueue = me.workaroundRefreshQueue,
            listId;

        // reselect active student if sparkpoint has changed
        if (
            operation === 'edit' &&
            me.getAppCt().getSelectedStudentSparkpoint() === selectedStudentSparkpoint &&
            modifiedFieldNames.indexOf('sparkpoint') !== -1
        ) {
            // TODO: redo this after switching sparkpoint generates a new studentSparkpoint rather than updating existing one
            me.getAppCt().setSelectedStudentSparkpoint(null);
            me.getAppCt().setSelectedStudentSparkpoint(selectedStudentSparkpoint);
        }

        // populate workaround queue
        listId = selectedStudentSparkpoint.get('active_phase') + 'List';
        if (workaroundRefreshQueue.indexOf(listId) == -1) {
            workaroundRefreshQueue.push(listId);
            me.workaroundRefreshListsTask.delay(500);
        }
    },

    onStudentSparkpointsStoreEndUpdate: function() {
        this.syncSelectedStudentSparkpoint();
    },

    onListSelectChange: function(list, i, t, record) {
        var me = this,
            appCt = me.getAppCt(),
            multiselect = appCt.getStudentMultiselectEnabled(),
            count = 0,
            lists = me.getGpsCt().query('#phasesCt list'),
            multiSelections = [];

        appCt.setSelectedStudentSparkpoint(multiselect ? null : record);

        // Get the selections from all phase lists and combine for multiselect.
        if (multiselect) {
            for (; count < lists.length; count++) {
                multiSelections = Ext.Array.union(multiSelections, lists[count].getSelections());
            }
        }

        appCt.setMultiSelectedSparkpoints(multiselect ? multiSelections : null);
    },

    onToggleStudentMultiselect: function(appCt, enable, oldVal) {
        var me = this,
            studentLists = me.getGpsCt().query('#phasesCt list'),
            studentList,
            count;

        if (enable === oldVal) {
            return;
        }

        for (count = 0; count < studentLists.length; count++) {
            studentList = studentLists[count];
            studentList.setMode(enable ? 'MULTI' : 'SINGLE');

            if (!enable) {
                studentList.deselectAll();
            }
        }
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            itemData = data.item,
            studentSparkpointsStore = me.getStudentSparkpointsStore(),
            studentSparkpointId = itemData.student_id + '_' + itemData.sparkpoint_id,
            studentSparkpoint = studentSparkpointsStore.findRecord('student_sparkpointid', studentSparkpointId);

        if (table === 'section_student_active_sparkpoint') {
            if (studentSparkpoint) {
                studentSparkpoint.set(itemData, {
                    dirty: false
                });
            } else {
                itemData.student = Ext.getStore('Students').getById(itemData.student_id);
                itemData.student_sparkpointid = studentSparkpointId; // eslint-disable-line camelcase
                studentSparkpointsStore.add(itemData);

                studentSparkpointsStore.filterBy(me.currentSparkpointsFilterFn, me);
            }
        } else if (table === 'student_sparkpoint') {
            if (studentSparkpoint) {
                studentSparkpoint.set(itemData, {
                    dirty: false
                });
            }
        }
    },

    onPhaseMoveChange: function(field, newVal) {
        var me = this,
            selectedStudentSparkpoints = me.getAppCt().getMultiSelectedSparkpoints(),
            studentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            count;

        if (!newVal) {
            return;
        }

        if (studentSparkpoint) {
            me.doMovePhase(studentSparkpoint, newVal.data.value);
        }

        if (selectedStudentSparkpoints) {
            for (count = 0; count < selectedStudentSparkpoints.length; count++) {
                studentSparkpoint = selectedStudentSparkpoints[count];
                if (!me.doMovePhase(studentSparkpoint, newVal.data.value)) {
                    break;
                }
            }
        }

        field.reset();
        return;
    },

    onAssignSparkpointSelect: function(field, selectedSparkpoint) {
        var me = this,
            selectedStudentSparkpoints = me.getAppCt().getMultiSelectedSparkpoints(),
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            i;

        if (selectedStudentSparkpoint) {
            me.doAssignSparkpoint(selectedStudentSparkpoint, selectedSparkpoint);
        }

        if (selectedStudentSparkpoints) {
            // loop through each student, find student sparkpoint and update last accessed
            for (i = 0; i < selectedStudentSparkpoints.length; i++) {
                me.doAssignSparkpoint(selectedStudentSparkpoints[i], selectedSparkpoint);
            }
        }

        field.reset();
        return;
    },


    // controller methods
    syncSelectedStudentSparkpoint: function() {
        var me = this,
            appCt = me.getAppCt(),
            activeStudent = appCt.getSelectedStudentSparkpoint(),
            multiselect = appCt.getStudentMultiselectEnabled(),
            lists = me.getGpsCt().query('#phasesCt list'),
            listCount = lists.length, i = 0, list, selectedExists = false, studentSparkpoint;

        // sync list selection
        for (; i < listCount; i++) {
            list = lists[i];

            if (activeStudent && list.getStore().indexOf(activeStudent) != -1) {
                list.select(activeStudent, multiselect);
                selectedExists = true;
            } else if (!multiselect) {
                list.deselectAll();
            }
        }

        // If the selected student sparkpoint doesn't exist in a list then the student may have switched their current sparkpoint.
        if (!selectedExists && activeStudent) {
            // Try to find student's current sparkpoint
            for (i = 0; i < listCount; i++) {
                list = lists[i];

                studentSparkpoint = list.getStore().findRecord('student_id', activeStudent.get('student_id'));

                if (studentSparkpoint) {
                    list.select(studentSparkpoint, multiselect);
                    me.getAppCt().setSelectedStudentSparkpoint(studentSparkpoint);
                    break;
                }
            }
        }
    },

    refreshGps: Ext.Function.createBuffered(function() {
        this.getStudentSparkpointsStore().loadUpdates();
    }, 1000),

    currentSparkpointsFilterFn: function(r) {
        var activeSparkpoints = Ext.getStore('StudentSparkpoints').queryBy(function(record) {
                return record.get('student_id') === r.get('student_id');
            }, this).getRange(),
            i = 0,
            len = activeSparkpoints.length;

        // we only want to keep the current (most recently accessed) sparkpoint for each student
        for (i; i < len; i++) {
            if (activeSparkpoints[i].get('last_accessed') > r.get('last_accessed')) {
                return false;
            }
        }

        return true;
    },

    /**
     * @private
     * This function manually refreshes all the lists queued for refresh to workaround bugs with lists refreshing themselves after chained store updates
     * TODO: remove this #hack when underlying #framework-bug gets fixed
     */
    workaroundRefreshLists: function() {
        var me = this,
            gpsCt = me.getGpsCt(),
            workaroundListCache = me.workaroundListCache,
            workaroundRefreshQueue = me.workaroundRefreshQueue,
            listId;

        while (listId = workaroundRefreshQueue.pop()) {
            (workaroundListCache[listId] || (workaroundListCache[listId] = gpsCt.down('#'+listId))).refresh();
        }
    },

    doMovePhase: function(studentSparkpoint, phase) {
        var overrides,
            error;

        switch (phase) {
            case 'Learn':
                if (studentSparkpoint.get('learn_finish_time')) {
                    error = 'Student has already finished learn phase.';
                }
                overrides = {
                    'learn_override_time': null,
                    'conference_override_time': null,
                    'apply_override_time': null,
                    'assess_override_time': null
                }
                break;
            case 'Conference':
                if (studentSparkpoint.get('conference_finish_time')) {
                    error = 'Student has already finished the conference phase.';
                }
                overrides = {
                    'learn_override_time': new Date(),
                    'conference_override_time': null,
                    'apply_override_time': null,
                    'assess_override_time': null
                }
                break;
            case 'Apply':
                if (studentSparkpoint.get('apply_finish_time')) {
                    error = 'Student has already finished the apply phase.';
                }
                overrides = {
                    'learn_override_time': new Date(),
                    'conference_override_time': new Date(),
                    'apply_override_time': null,
                    'assess_override_time': null
                }
                break;
            case 'Assess':
                if (studentSparkpoint.get('assess_finish_time')) {
                    error = 'Student has already finished the assess phase.';
                }
                overrides = {
                    'learn_override_time': new Date(),
                    'conference_override_time': new Date(),
                    'apply_override_time': new Date(),
                    'assess_override_time': null
                }
                break;
            default:
        }

        if (error) {
            Ext.Msg.alert('Can\'t move to ' + phase + ' phase.', error);
            return false;
        }

        studentSparkpoint.set(overrides);
        studentSparkpoint.save();
        return true;
    },

    doAssignSparkpoint: function(selectedStudentSparkpoint, selectedSparkpoint) {
        var me = this,
            studentSparkpointsStore = me.getStudentSparkpointsStore(),
            studentId = selectedStudentSparkpoint.get('student_id'),
            selectedSparkpointId = selectedSparkpoint.get('id'),
            newStudentSparkpoint = studentSparkpointsStore.findRecord('student_sparkpointid', studentId + '_' + selectedSparkpointId);

        if (newStudentSparkpoint) {
            newStudentSparkpoint.set('forceActive', new Date());
            newStudentSparkpoint.save();
        } else {
            Slate.API.request({
                method: 'PATCH',
                url: '/spark/api/work/activity',
                jsonData: {
                    'student_id': studentId,
                    'sparkpoint_id': selectedSparkpointId,
                    'forceActive': true
                }
            });
        }
    }
});