Ext.define('SparkClassroomTeacher.controller.Priorities', {
    extend: 'Ext.app.Controller',
    requires: [
        /* global SparkClassroom */
        'SparkClassroom.data.field.SparkDate'
    ],


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
        appCt: 'spark-teacher-appct',
        priorityList: 'spark-teacher-priorities'
    },

    control: {
        appCt: {
            selectedstudentsparkpointchange: 'syncSelectedStudentSparkpoint',
            multiselectedsparkpointschange: 'syncSelectedStudentSparkpoint'
        }
    },


    // event handlers
    onStudentsLoad: function() {
        this.getGpsPrioritiesStore().load();
    },

    // controller methods
    syncSelectedStudentSparkpoint: function() {
        // TODO: share code with similar function in GPS controller
        var me = this,
            appCt = me.getAppCt(),
            activeStudent = appCt.getSelectedStudentSparkpoint(),
            activeStudents = appCt.getMultiSelectedSparkpoints(),
            list = me.getPriorityList();

        if (activeStudent && list.getStore().indexOf(activeStudent) != -1) {
            list.select(activeStudent);
        } else if (activeStudents) {
            // sync multiselected students
            list.setMode('MULTI');
            list.select(activeStudents);
            // reset to SINGLE after selection to avoid unknown effects (Selectable is a private class)
            list.setMode('SINGLE');
        } else {
            list.deselectAll();
        }
    },

    refreshPriorities: Ext.Function.createBuffered(function() {
        this.getGpsPrioritiesStore().loadUpdates();
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
            studentSparkpoint;

        if (table == 'section_student_active_sparkpoint') {
            if (
                itemData.section_code == me.getAppCt().getSelectedSection()
                && (
                    !(studentSparkpoint = me.getGpsPrioritiesStore().findRecord('student_id', itemData.student_id))
                    || ( // eslint-disable-line no-extra-parens
                        studentSparkpoint.get('sparkpoint_id') != itemData.sparkpoint_id
                        && studentSparkpoint.get('last_accessed') < SparkClassroom.data.field.SparkDate.prototype.convert(itemData.last_accessed)
                    )
                )
            ) {
                // TODO: handle this without a full refresh if possible
                me.refreshPriorities();
            }
        } else if (table == 'student_sparkpoint') {
            studentSparkpointId = itemData.student_id + '_' + itemData.sparkpoint_id;

            if (studentSparkpoint = me.getGpsPrioritiesStore().getById(studentSparkpointId)) { // eslint-disable-line no-cond-assign
                studentSparkpoint.set(itemData, { dirty: false });
            }
        }
    }
});