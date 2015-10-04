/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.GPS', {
    extend: 'Ext.app.Controller',
    require: [
        'Ext.util.TaskManager'
    ],


    config: {
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
            }
        }
    },

    refs: {
        gpsCt: 'spark-gps',
        priorityList: 'list#priorityList',
        addPriorityButton: 'spark-gps button#addPriorityBtn'
    },

    control: {
        gpsCt: {
            studentselect: 'onStudentSelect'
        },
        'spark-gps-studentlist': {
            select: 'onListSelect'
        },
        addPriorityButton: {
            tap: 'onAddPriorityButtonTap'
        }
    },


    // config handlers
    updateActiveSection: function(section) {
        // TODO: delete if uneeded
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
                run: activeStudentsStore.load
            });
        }

        refreshTask.stop();
        activeStudentsStore.getProxy().setExtraParam('section_id', me.getActiveSection());
        refreshTask.start();
    },

    onListSelect: function(list, rec) {
        var container = this.getGpsCt(),
            lists = container.query('list'),
            listCount = lists.length,
            i = 0;

        for (i; i < listCount; i++) {
            if (lists[i] !== list) {
                lists[i].deselectAll();
            }
        }

        container.fireEvent('studentselect', rec, list);
    },

    onStudentSelect: function(rec, list) {
        var me = this,
            button = me.getAddPriorityButton(),
            priorityIndex = me.getPriorityList().getStore().indexOf(rec);

        if (priorityIndex === -1) {
            me.getGpsCt().setSelectedStudent(rec);
            button.setData(rec.getData());
            button.show();
        } else {
            button.hide();
        }
    },

    onAddPriorityButtonTap: function(button) {
        var activeStudent = this.getGpsCt().getSelectedStudent();

        activeStudent.set('priority_group', 2);
        button.hide();
    }
});