/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.Container', {
    extend: 'SparkClassroom.work.conference.Main',
    xtype: 'spark-teacher-work-conference',
    requires: [
        'SparkClassroomTeacher.view.work.conference.Feedback',
        'SparkClassroomTeacher.view.work.conference.peer.Component'
    ],

    initialize: function () {
        this.callParent(arguments);

        this.add({
            xtype: 'spark-teacher-work-conference-feedback',
            docked: 'right',
            cls: 'sidebar-col is-wide',
            scrollable: false
        });

        this.add({
            xtype: 'spark-teacher-work-conference-peer-component'
        });
    }
});