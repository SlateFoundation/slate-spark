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
    }
});