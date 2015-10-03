/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.GPS', {
    extend: 'Ext.app.Controller',


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
        priorityAddButton: 'spark-gps button#priority-add'
    },

    control: {
        gpsCt: {
            studentselect: 'onStudentSelect'
        },
        'spark-gps-studentlist': {
            select: 'onListSelect'
        },
        priorityAddButton: {
            tap: 'onPriorityAddButtonTapped'
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

    onStudentsStoreLoad: function(studentsStore) {
        this.getGpsActiveStudentsStore().load({
            params: {
                section_id: this.getActiveSection()
            }
        });
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
            button = me.getPriorityAddButton(),
            priorityIndex = me.getPriorityList().getStore().indexOf(rec);

        if (priorityIndex === -1) {
            me.getGpsCt().setSelectedStudent(rec);
            button.setData(rec.getData());
            button.show();
        } else {
            button.hide();
        }
    },

    onPriorityAddButtonTapped: function(button) {
        var rec = this.getGpsCt().getSelectedStudent();

        rec.set('Priority', 2);
        button.hide();
    }
});