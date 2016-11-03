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
                endupdate: 'syncSelectedStudentSparkpoint'
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
            selectedstudentsparkpointchange: 'syncSelectedStudentSparkpoint'
        },
        'spark-gps-studentlist': {
            select: 'onListSelect'
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
            workaroundRefreshQueue = me.workaroundRefreshQueue,
            listId;

        // reselect active student if sparkpoint has changed
        if (
            operation == 'edit' &&
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

    onListSelect: function(list, studentSparkpoint) {
        this.getAppCt().setSelectedStudentSparkpoint(studentSparkpoint);
    },

    // TODO: duplicate process into blocked controller
    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            itemData = data.item,
            studentSparkpointId,
            studentSparkpoint,
            updatedFields;

        if (table == 'section_student_active_sparkpoint') {
            if (
                itemData.section_code == me.getAppCt().getSelectedSection() &&
                (
                    !(studentSparkpoint = me.getStudentSparkpointsStore().findRecord('student_id', itemData.student_id)) ||
                    (
                        studentSparkpoint.get('sparkpoint_id') != itemData.sparkpoint_id &&
                        studentSparkpoint.get('last_accessed') < SparkClassroom.data.field.SparkDate.prototype.convert(itemData.last_accessed)
                    )
                )
            ) {
                // TODO: handle this without a full refresh if possible
                me.refreshGps();
            }
        } else if (table == 'student_sparkpoint') {
            studentSparkpointId = itemData.student_id + '_' + itemData.sparkpoint_id;

            if ((studentSparkpoint = me.getStudentSparkpointsStore().getById(studentSparkpointId))) {
                updatedFields = studentSparkpoint.set(itemData, { dirty: false });
            }
        }
    },


    // controller methods
    syncSelectedStudentSparkpoint: function() {
        var me = this,
            currentStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            lists = me.getGpsCt().query('#phasesCt list'),
            i, list;

        // sync list selection
        for (i = 0; i < lists.length; i++) {
            list = lists[i];

            if (currentStudentSparkpoint && list.getStore().indexOf(currentStudentSparkpoint) != -1) {
                list.select(currentStudentSparkpoint);
            } else {
                list.deselectAll();
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