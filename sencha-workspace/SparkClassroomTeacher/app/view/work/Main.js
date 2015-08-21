/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.Main', {
    extend: 'SparkClassroom.work.Main',
    xtype: 'spark-teacher-work',
    requires: [
        'Ext.tab.Bar'
    ],

    config: {
        students: [
            {FirstName: 'Anthony', LastName: 'Harley', student_id: 1},
            {FirstName: 'Chris', LastName: 'Alfano', student_id: 2}
        ]
    },

    initialize: function() {

        this.callParent(arguments);

        // TODO: add other teacher-only decoration here with this.down('foo').add/insert
    },

    updateStudents: function(students) {
        var studentTabs = Ext.Array.map(students, function(student) {
            return {
                // TODO: when student becomes a model, use a calculated field for FullName instead
                title: student.FirstName + ' ' + student.LastName.substr(0,1) + '.',
                student_id: student.student_id
            }
        });


        if (students.length == 1) {
            // single student mode, remove students list if it exists
            if (this.studentsBar) {

            }
        } else {
            // multi student mode, inject students tabbar with
            this.studentsBar = this.insert(
                0,
                {
                    xtype: 'tabbar',
                    tabType: 'studentTab',
                    items: studentTabs
                }
             );
        }
    }
});
