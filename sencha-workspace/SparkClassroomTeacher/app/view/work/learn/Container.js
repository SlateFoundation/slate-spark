/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.learn.Container', {
    extend: 'SparkClassroom.work.learn.Main',
    xtype: 'spark-teacher-work-learn',
    requires: [
        'SparkClassroomTeacher.view.work.learn.Form'
    ],

    initialize: function () {
        this.callParent(arguments);
        
        this.add({
            xtype: 'spark-teacher-work-learn-form',
            docked: 'right',
            cls: 'sidebar-col'
        });
    }
});