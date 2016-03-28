/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Priorities', {
    extend: 'Ext.app.Controller',


    config: {
        /**
         * @private
         * Tracks section last selected via {@link #event-sectionselect}
         */
        activeSection: null
    },


    // entry points
    listen: {
        controller: {
            '#': {
                sectionselect: 'onSectionSelect'
            }
        },
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
        appCt: 'spark-teacher-appct',
        priorityList: 'spark-teacher-priorities'
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

    onSectionSelect: function(section) {
        this.setActiveSection(section);
    },

    // controller methods
    syncSelectedStudentSparkpoint: function() {
        // TODO: share code with similar function in GPS controller
        var me = this,
            activeStudent = me.getAppCt().getSelectedStudentSparkpoint(),
            list = me.getPriorityList();

        if (activeStudent && list.getStore().indexOf(activeStudent) != -1) {
            list.select(activeStudent);
        } else {
            list.deselectAll();
        }
    },

    refreshPriorities: Ext.Function.createBuffered(function() {
        Ext.getStore('gps.Priorities').loadUpdates();
    }, 1000),

    onSocketData: function(socket, data) {
        // TODO: make like the GPS controller and blindly refresh the whole priorities store each time an
        //       event is seen that may indicate new data. We need data from two tables to know what should
        //       be in the list and dealing with that is pretty hairy right now.
        //       - a student_section_active_sparkpoint record being inserted to this section should trigger a refresh
        //       - a student_sparkpoint record updating that matches a student loaded into our Students store should
        //         trigger a refresh

        var me = this,
            table = data.table,
            itemData = data.item,
            studentSparkpointId,
            studentSparkpoint,
            updatedFields;

        if (table == 'section_student_active_sparkpoint') {
            if (
                itemData.section_code == me.getActiveSection() &&
                (
                    !(studentSparkpoint = Ext.getStore('gps.Priorities').findRecord('student_id', itemData.student_id)) ||
                    (
                        studentSparkpoint.get('sparkpoint_id') != itemData.sparkpoint_id &&
                        studentSparkpoint.get('last_accessed') < SparkClassroom.data.field.SparkDate.prototype.convert(itemData.last_accessed)
                    )
                )
            ) {
                // TODO: handle this without a full refresh if possible
                me.refreshPriorities();
            }
        } else if (table == 'student_sparkpoint') {
            studentSparkpointId = itemData.student_id + '-' + itemData.sparkpoint_id;

            if ((studentSparkpoint = Ext.getStore('gps.Priorities').getById(studentSparkpointId))) {
                updatedFields = studentSparkpoint.set(itemData, { dirty: false });
            }
        }
    }
});