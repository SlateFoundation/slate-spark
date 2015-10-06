/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.assess.Container', {
    extend: 'SparkClassroom.work.assess.Main',
    xtype: 'spark-student-work-assess',
    requires: [
        'SparkClassroomStudent.view.work.assess.AppliesGrid',
        'SparkClassroomStudent.view.work.assess.Footer'
    ],

    initialize: function () {
        this.callParent(arguments);

        this.add([
            {
                xtype: 'spark-student-work-assess-appliesgrid'
            },
            {
                xtype: 'spark-student-work-assess-footer',
                margin: '0 0 100'
            }
        ]);
    }
});