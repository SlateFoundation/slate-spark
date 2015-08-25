/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.Container', {
    extend: 'SparkClassroom.work.conference.Main',
    xtype: 'spark-teacher-work-conference',
    requires: [
        'SparkClassroomTeacher.view.work.conference.Form',
        'SparkClassroomTeacher.view.work.conference.peer.Component'
    ],

    config: {
        layout: 'hbox'
    },
    
    initialize: function () {
        this.callParent(arguments);
        
        this.add({
            xtype: 'spark-teacher-work-conference-form',
            width: '30%'
        });
        
        this.getComponent('standardContainer').add({
            xtype: 'spark-teacher-work-conference-peer-component'
        });
    }
});