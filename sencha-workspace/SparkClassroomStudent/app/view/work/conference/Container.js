/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.conference.Container', {
    extend: 'SparkClassroom.work.conference.Main',
    xtype: 'spark-student-work-conference',
    requires: [
        'SparkClassroomStudent.view.work.conference.PeerForm'
    ],

    initialize: function () {
        this.callParent(arguments);

        this.add({
            xtype: 'spark-student-work-conference-peerform'
        });
    }
});