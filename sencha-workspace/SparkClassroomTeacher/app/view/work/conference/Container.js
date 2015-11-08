/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.Container', {
    extend: 'SparkClassroom.work.conference.Container',
    xtype: 'spark-teacher-work-conference',
    requires: [
        'Ext.data.ChainedStore',
        'SparkClassroom.work.FeedbackView',
        'SparkClassroomTeacher.view.work.conference.Feedback',
        'SparkClassroomTeacher.view.work.conference.Worksheet'
    ],

    initialize: function () {
        this.callParent(arguments);

        this.add([{
            xtype: 'spark-teacher-work-conference-feedback',
            docked: 'right',
            cls: 'sidebar-col is-wide',
            scrollable: false
        },{
            xtype: 'spark-teacher-work-conference-worksheet'
        },{
            xtype: 'spark-feedbackview',

            store: {
                type: 'chained',
                source: 'work.Feedback',
                filters: [{
                    property: 'phase',
                    value: 'conference'
                }]
            }
        }]);
    }
});