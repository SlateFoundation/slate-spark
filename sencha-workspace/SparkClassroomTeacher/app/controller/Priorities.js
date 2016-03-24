/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Priorities', {
    extend: 'Ext.app.Controller',


    // entry points
    listen: {
        store: {
            '#Students': {
                load: 'onStudentsLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    // controller config
    stores: [
        'gps.Priorities'
    ],

    refs: {
        appCt: 'spark-teacher-appct'
    },

    control: {
        appCt: {
            selectedstudentsparkpointchange: 'onSelectedStudentSparkpointChange'
        },
    },


    // event handlers
    onStudentsLoad: function() {
        Ext.getStore('gps.Priorities').load();
    },

    onSelectedStudentSparkpointChange: function() {
        this.syncSelectedStudentSparkpoint();
    },

    // controller methods
    syncSelectedStudentSparkpoint: function() {
        // TODO: share code with similar function in GPS controller
        var me = this,
            activeStudent = me.getAppCt().getSelectedStudentSparkpoint(),
            lists = me.getAppCt().query('#priorityList'),
            listCount = lists.length, i = 0, list;

        // sync list selection
        for (; i < listCount; i++) {
            list = lists[i];

            if (activeStudent && list.getStore().indexOf(activeStudent) != -1) {
                list.select(activeStudent);
            } else {
                list.deselectAll();
            }
        }
    },

    onSocketData: function(socket, data) {
        // TODO: make like the GPS controller and blindly refresh the whole priorities store each time an
        //       event is seen that may indicate new data. We need data from two tables to know what should
        //       be in the list and dealing with that is pretty hairy right now.
        //       - a student_section_active_sparkpoint record being inserted to this section should trigger a refresh
        //       - a student_sparkpoint record updating that matches a student loaded into our Students store should
        //         trigger a refresh
    }
});