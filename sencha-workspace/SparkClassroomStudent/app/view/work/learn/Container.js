Ext.define('SparkClassroomStudent.view.work.learn.Container', {
    extend: 'SparkClassroom.work.learn.Container',
    xtype: 'spark-student-work-learn',
    requires: [
        'Ext.data.ChainedStore',
        'SparkClassroom.work.FeedbackView'
    ],


    initialize: function () {
        this.callParent(arguments);

        this.add([
            {
                docked: 'bottom',

                xtype: 'spark-feedbackview',
                store: {
                    type: 'chained',
                    source: 'work.Feedback',
                    filters: [{
                        property: 'phase',
                        value: 'learn'
                    }]
                }
            },
            {
                docked: 'bottom',

                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [
                    {
                        itemId: 'readyForConferenceBtn',

                        xtype: 'button',
                        disabled: true,
                        ui: 'action',
                        text: 'Ready for Conference'
                    }
                ]
            }
        ]);
    }
});