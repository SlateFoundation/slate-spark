/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.conference.Container', {
    extend: 'SparkClassroom.work.conference.Container',
    xtype: 'spark-student-work-conference',
    requires: [
        'SparkClassroomStudent.view.work.conference.PeerForm'
    ],

    initialize: function () {
        this.callParent(arguments);

        this.add([{
            xtype: 'spark-student-work-conference-peerform'
        },{
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            items: [
                {
                    itemId: 'requestConferenceBtn',

                    xtype: 'button',
                    ui: 'action',
                    text: 'Request a Conference'
                }
            ]
        }]);
    }
});