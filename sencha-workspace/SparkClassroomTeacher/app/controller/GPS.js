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
        'Ext.util.DelayedTask',

        /* global Slate */
        'Slate.API'
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
                endupdate: 'syncSelectedStudentSparkpoint'
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
            selectedstudentsparkpointchange: 'syncSelectedStudentSparkpoint',
            togglestudentmultiselect: 'onToggleStudentMultiselect'
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
    onStudentsStoreLoad: function(studentsStore, students, success) {
        var me = this;

        if (!success) {
            return;
        }

        me.getStudentSparkpointsStore().load();
    },

    onStudentSparkpointsUpdate: function(store, selectedStudentSparkpoint, operation, modifiedFieldNames) {
        var me = this,
            appCt = me.getAppCt(),
            workaroundRefreshQueue = me.workaroundRefreshQueue,
            listId;

        // reselect active student if sparkpoint has changed
        if (
            operation === 'edit'
            && me.getAppCt().getSelectedStudentSparkpoint() === selectedStudentSparkpoint
            && modifiedFieldNames.indexOf('sparkpoint') !== -1
        ) {
            // TODO: redo this after switching sparkpoint generates a new studentSparkpoint rather than updating existing one
            appCt.setSelectedStudentSparkpoint(null);
            appCt.setSelectedStudentSparkpoint(selectedStudentSparkpoint);
        }

        // populate workaround queue
        listId = selectedStudentSparkpoint.get('active_phase') + 'List';
        if (workaroundRefreshQueue.indexOf(listId) == -1) {
            workaroundRefreshQueue.push(listId);
            me.workaroundRefreshListsTask.delay(500);
        }
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
    },


    // controller methods
    syncSelectedStudentSparkpoint: function() {
        var me = this,
            appCt = me.getAppCt(),
            currentStudentSparkpoint = appCt.getSelectedStudentSparkpoint(),
            multiselect = appCt.getStudentMultiselectEnabled(),
            lists = me.getGpsCt().query('#phasesCt list'),
            i, list;

        // sync list selection
        for (i = 0; i < lists.length; i++) {
            list = lists[i];

            if (currentStudentSparkpoint && list.getStore().indexOf(currentStudentSparkpoint) !== -1) {
                list.select(currentStudentSparkpoint, multiselect);
            } else if (!multiselect) {
                list.deselectAll();
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

        while (listId = workaroundRefreshQueue.pop()) { // eslint-disable-line no-cond-assign
            (workaroundListCache[listId] || (workaroundListCache[listId] = gpsCt.down('#'+listId))).refresh();
        }
    },

    doMovePhase: function(studentSparkpoint, phase) {
        var student = studentSparkpoint.get('student'),
            studentName = student ? student.get('FirstName') : 'Student',
            overrides,
            error,
            prettyDate;

        switch (phase) {
            case 'Learn':
                if (studentSparkpoint.get('learn_finish_time')) {
                    prettyDate = Ext.Date.format(studentSparkpoint.get('learn_finish_time'), 'm/d/Y');
                    error = studentName + ' completed the Learn & Practice phase for this Sparkpoint on ' + prettyDate + '. Please select a phase that has not been completed or was credited by a teacher.';
                }
                overrides = {
                    'learn_override_time': null,
                    'conference_override_time': null,
                    'apply_override_time': null,
                    'assess_override_time': null
                };
                break;
            case 'Conference':
                if (studentSparkpoint.get('conference_finish_time')) {
                    prettyDate = Ext.Date.format(studentSparkpoint.get('conference_finish_time'), 'm/d/Y');
                    error = studentName + ' completed the Conference phase for this Sparkpoint on ' + prettyDate + '. Please select a phase that has not been completed or was credited by a teacher.';
                }
                overrides = {
                    'learn_override_time': new Date(),
                    'conference_override_time': null,
                    'apply_override_time': null,
                    'assess_override_time': null
                };
                break;
            case 'Apply':
                if (studentSparkpoint.get('apply_finish_time')) {
                    prettyDate = Ext.Date.format(studentSparkpoint.get('apply_finish_time'), 'm/d/Y');
                    error = studentName + ' completed the Apply phase for this Sparkpoint on ' + prettyDate + '. Please select a phase that has not been completed or was credited by a teacher.';
                }
                overrides = {
                    'learn_override_time': new Date(),
                    'conference_override_time': new Date(),
                    'apply_override_time': null,
                    'assess_override_time': null
                };
                break;
            case 'Assess':
                if (studentSparkpoint.get('assess_finish_time')) {
                    prettyDate = Ext.Date.format(studentSparkpoint.get('assess_finish_time'), 'm/d/Y');
                    error = studentName + ' completed the Assess phase for this Sparkpoint on ' + prettyDate + '. Please select a phase that has not been completed or was credited by a teacher.';
                }
                overrides = {
                    'learn_override_time': new Date(),
                    'conference_override_time': new Date(),
                    'apply_override_time': new Date(),
                    'assess_override_time': null
                };
                break;
            default:
        }

        if (error) {
            Ext.Msg.alert('Phase Crediting Conflict', error);
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