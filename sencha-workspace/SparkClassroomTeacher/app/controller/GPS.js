/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.GPS', {
    extend: 'Ext.app.Controller',
    require: [
        'Ext.util.TaskManager'
    ],


    config: {
        selectedActiveStudent: null,
        activeSection: null
    },


    stores: [
        'gps.ActiveStudents',

        'gps.Learn',
        'gps.Conference',
        'gps.Apply',
        'gps.Assess',

        'gps.Priorities',
        'gps.Help'
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
                endupdate: 'onActiveStudentsStoreEndUpdate'
            }
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
        }
    },


    // config handlers
    updateSelectedActiveStudent: function(activeStudent, oldActiveStudent) {
        this.syncSelectedActiveStudent();
        this.getApplication().fireEvent('activestudentselect', activeStudent, oldActiveStudent);
    },


    // event handlers
    onSectionSelect: function(section) {
        this.setActiveSection(section);
    },

    onStudentsStoreLoad: function(studentsStore, students, success) {
        var me = this,
            refreshTask = me.refreshTask,
            activeStudentsStore = me.getGpsActiveStudentsStore();

        if (!success) {
            return;
        }

        // create refresh task if needed
        if (!refreshTask) {
            refreshTask = me.refreshTask = Ext.util.TaskManager.newTask({
                interval: 5000,
                fireOnStart: true,
                scope: activeStudentsStore,
                run: activeStudentsStore.loadUpdates
            });
        }

        refreshTask.stop();
        activeStudentsStore.getProxy().setExtraParam('section_id', me.getActiveSection());
        refreshTask.start();
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


    // controller methods
    syncSelectedActiveStudent: function() {
        var me = this,
            activeStudent = me.getSelectedActiveStudent(),
            lists = me.getGpsCt().query('list'),
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
    }
});