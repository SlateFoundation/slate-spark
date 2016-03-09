/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
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


    config: {
        /**
         * @private
         * Tracks the currently selected {@link SparkClassroomTeacher.model.gps.ActiveStudent}
         */
        selectedActiveStudent: null,

        /**
         * @private
         * Tracks section last selected via {@link #event-sectionselect}
         */
        activeSection: null
    },


    stores: [
        'gps.ActiveStudents',

        'gps.Learn',
        'gps.Conference',
        'gps.Apply',
        'gps.Assess',

        'gps.Priorities'
    ],

    listen: {
        controller: {
            '#': {
                sectionselect: 'onSectionSelect'
            }
        },
        store: {
            '#Students': {
                load: 'onStudentsStoreLoad'
            },
            '#gps.ActiveStudents': {
                update: 'onActiveStudentStoreUpdate',
                endupdate: 'onActiveStudentsStoreEndUpdate'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    refs: {
        gpsCt: 'spark-gps',
        priorityList: 'list#priorityList',
        addPriorityButton: 'spark-gps button#addPriorityBtn'
    },

    control: {
        'spark-gps-studentlist': {
            select: 'onListSelect'
        },
        addPriorityButton: {
            tap: 'onAddPriorityButtonTap'
        },
        'spark-gps-studentlist#priorityList': {
            itemdismisstap: 'onPriorityDismissTap'
        }
    },


    // controller templates methods
    init: function() {
        var me = this;

        me.workaroundRefreshQueue = [];
        me.workaroundListCache = {};
        me.workaroundRefreshListsTask = new Ext.util.DelayedTask(me.workaroundRefreshLists, me);
    },


    // config handlers
    updateActiveSection: function() {
        this.setSelectedActiveStudent(null);
    },

    updateSelectedActiveStudent: function(activeStudent, oldActiveStudent) {
        this.syncSelectedActiveStudent();
        this.getApplication().fireEvent('activestudentselect', activeStudent, oldActiveStudent);
    },


    // event handlers
    onSectionSelect: function(section) {
        this.setActiveSection(section);
    },

    onStudentsStoreLoad: function(studentsStore, students, success) {
        var me = this;

        if (!success) {
            return;
        }

        me.getGpsActiveStudentsStore().load();
    },

    onActiveStudentStoreUpdate: function(store, activeStudent, operation, modifiedFieldNames) {
        var me = this,
            workaroundRefreshQueue = me.workaroundRefreshQueue,
            listId;

        // reselect active student if sparkpoint has changed
        if (
            operation == 'edit' &&
            me.getSelectedActiveStudent() === activeStudent &&
            modifiedFieldNames.indexOf('sparkpoint') !== -1
        ) {
            me.setSelectedActiveStudent(null);
            me.setSelectedActiveStudent(activeStudent);
        }

        // populate workaround queue
        listId = activeStudent.get('active_phase') + 'List';
        if (workaroundRefreshQueue.indexOf(listId) == -1) {
            workaroundRefreshQueue.push(listId);
            me.workaroundRefreshListsTask.delay(500);
        }
    },

    onActiveStudentsStoreEndUpdate: function() {
        this.syncSelectedActiveStudent();
    },

    onListSelect: function(list, student) {
        this.setSelectedActiveStudent(student);
    },

    onAddPriorityButtonTap: function(button) {
        this.getSelectedActiveStudent().set('priority_group', 2);
        this.syncSelectedActiveStudent();
    },

    onPriorityDismissTap: function(list, item) {
        item.getRecord().set('priority_group', null);
        this.syncSelectedActiveStudent();
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            itemData = data.item,
            activeStudent,
            updatedFields;

        if (table == 'section_student_active_sparkpoint') {
            if (
                itemData.section_code == me.getActiveSection() &&
                (
                    !(activeStudent = me.getGpsActiveStudentsStore().getById(itemData.student_id)) ||
                    (
                        activeStudent.get('sparkpoint_id') != itemData.sparkpoint_id &&
                        activeStudent.get('last_accessed') < SparkClassroom.data.field.SparkDate.prototype.convert(itemData.last_accessed)
                    )
                )
            ) {
                // TODO: handle this without a full refresh if possible
                me.refreshGps();
            }
        } else if (table == 'student_sparkpoint') {
            if (
                (activeStudent = me.getGpsActiveStudentsStore().getById(itemData.student_id)) &&
                activeStudent.get('sparkpoint_id') == itemData.sparkpoint_id
            ) {
                updatedFields = activeStudent.set(itemData, { dirty: false });
            }
        }
    },


    // controller methods
    syncSelectedActiveStudent: function() {
        var me = this,
            activeStudent = me.getSelectedActiveStudent(),
            lists = me.getGpsCt().query('#phasesCt list'),
            listCount = lists.length, i = 0, list,
            addPriorityButton = me.getAddPriorityButton();

        // sync list selection
        for (; i < listCount; i++) {
            list = lists[i];

            if (activeStudent && list.getStore().indexOf(activeStudent) != -1) {
                list.select(activeStudent);
            } else {
                list.deselectAll();
            }
        }

        // sync add-to-priorities button
        if (activeStudent && activeStudent.get('priority_group') === null) {
            addPriorityButton.setData(activeStudent.getData());
            addPriorityButton.show();
        } else {
            addPriorityButton.hide();
        }
    },

    refreshGps: Ext.Function.createBuffered(function() {
        this.getGpsActiveStudentsStore().loadUpdates();
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