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
        gps: 'spark-gps',
        priorityList: 'list#priorityList',
        priorityAddButton: 'spark-gps button#priority-add'
    },

    control: {
        gps: {
            studentselect: 'onStudentSelect'
        },
        'spark-gps-studentList': {
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
            var status = ['Learn', 'Conference', 'Apply', 'Assess'],
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
        var container = this.getGps(),
            lists = container.query('list'),
            listCount = lists.length,
            i = 0;

        for (i; i<listCount; i++) {
            if (lists[i].getItemId()!==list.getItemId()) {
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
            button.setData(rec);
            button.show();
        } else {
            button.hide();
        }
    },

    onPriorityAddButtonTapped: function(button) {
        var rec = button.getData();

        rec.set('Priority', 2);
        button.hide();
    }
});
