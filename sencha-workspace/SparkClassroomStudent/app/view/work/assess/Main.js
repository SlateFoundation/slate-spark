/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.assess.Main', {
    extend: 'SparkClassroom.work.assess.Main',
    xtype: 'spark-student-work-assess',
    requires: [
        'SparkClassroomStudent.view.work.assess.ProjectGrid',
        'SparkClassroomStudent.view.work.assess.Footer'
    ],

    initialize: function () {
        this.callParent(arguments);
        
        this.add({
            xtype: 'spark-student-work-assess-projectgrid'
        },{
            xtype: 'spark-student-work-assess-footer'
        });
    }
});