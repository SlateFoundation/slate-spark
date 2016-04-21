Ext.define('SparkClassroomStudent.view.work.conference.Container', {
    extend: 'SparkClassroom.work.conference.Container',
    xtype: 'spark-student-work-conference',
    requires: [
        'Ext.data.ChainedStore',
        'SparkClassroom.work.FeedbackView',
        'SparkClassroomStudent.view.work.conference.Worksheet'
    ],

    initialize: function () {
        this.callParent(arguments);

        this.add([{
            xtype: 'spark-student-work-conference-worksheet'
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