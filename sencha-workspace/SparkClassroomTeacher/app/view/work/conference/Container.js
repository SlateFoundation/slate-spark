/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.Container', {
    extend: 'SparkClassroom.work.conference.Main',
    xtype: 'spark-teacher-work-conference',
    requires: [
        'SparkClassroomTeacher.view.work.conference.Form',
        'SparkClassroomTeacher.view.work.conference.peer.Component'
    ],

    initialize: function () {
        this.callParent(arguments);
        
        this.add({
            xtype: 'spark-teacher-work-conference-form',
            docked: 'right',
            cls: 'sidebar-col',
            scrollable: false
        });
        
        this.getComponent('standardContainer').add({
            xtype: 'spark-teacher-work-conference-peer-component'
        });
    }
});