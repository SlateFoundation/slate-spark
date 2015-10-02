/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.GPS', {
    extend: 'Ext.app.Controller',

    stores: [
        'gps.Learn',
        'gps.Conference',
        'gps.Apply',
        'gps.Assess',

        'gps.Priorities',
        'gps.Help'
    ],

    listen: {
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

    onStudentsStoreLoad: function(store, records) {
        var sectionStore = Ext.getStore('SectionStudents');

        for (var i = 0; i < records.length; i++) {

            // temp mock data generation script
            var status = ['learn', 'conference', 'apply', 'assess'],
                grades = ['L', '*', 'G', 'N'],
                mod = i % 4,
                randomIncrement = Math.floor(Math.random() * 4),
                record = records[i];

            // add data from students store to SectionStudentStore
            sectionStore.add({
                Student: record.getData(),
                Section: status[randomIncrement],
                GPSStatus: status[randomIncrement],
                GPSStatusGroup: 24,
                Help: mod == 2 ? true : '',
                Priority: mod == 2 ? 2 : '',
                Standards: ['CC.Content', 'CC.SS.Math.Content'],
                Grade: grades[randomIncrement]
            });

        }
    },

    onListSelect: function(list, rec) {
        var container = this.getGpsCt(),
            lists = container.query('list'),
            listCount = lists.length,
            i = 0;

        for (i; i<listCount; i++) {
            if (lists[i]!==list) {
                lists[i].deselectAll();
            }
        }

        container.fireEvent('studentselect', rec, list);
    },

    onStudentSelect: function(rec, list) {
        var priorityList = this.getPriorityList(),
            button = this.getPriorityAddButton();

        priorityIndex = priorityList.getStore().indexOf(rec);

        if (priorityIndex === -1) {
            this.getGpsCt().setSelectedStudent(rec);
            button.setData(rec.data);
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
