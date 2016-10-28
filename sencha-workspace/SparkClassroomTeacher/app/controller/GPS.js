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
        gpsCt: 'spark-gps'
    },

    control: {
        appCt: {
            selectedstudentsparkpointchange: 'onSelectedStudentSparkpointChange',
            togglestudentmultiselect: 'onToggleStudentMultiselect'
        },
        'spark-gps-studentlist': {
            itemtap: 'onListSelectChange' // itemtap is used to isolate the individual student being selected
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

    // TODO: duplicate process into blocked controller
    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            itemData = data.item,
            studentSparkpointId,
            studentSparkpoint,
            updatedFields;

        if (table === 'section_student_active_sparkpoint') {
            if (
                itemData.section_code === me.getAppCt().getSelectedSection() &&
                (
                    !(studentSparkpoint = me.getStudentSparkpointsStore().findRecord('student_id', itemData.student_id)) ||
                    (
                        studentSparkpoint.get('sparkpoint_id') !== itemData.sparkpoint_id &&
                        studentSparkpoint.get('last_accessed') < SparkClassroom.data.field.SparkDate.prototype.convert(itemData.last_accessed)
                    )
                )
            ) {
                // TODO: handle this without a full refresh if possible
                me.refreshGps();
            }
        } else if (table === 'student_sparkpoint') {
            studentSparkpointId = itemData.student_id + '_' + itemData.sparkpoint_id;

            if ((studentSparkpoint = me.getStudentSparkpointsStore().getById(studentSparkpointId))) {
                updatedFields = studentSparkpoint.set(itemData, { dirty: false });
            }
        }
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
    }
});