Ext.define('SparkClassroomTeacher.view.work.learn.Container', {
    extend: 'SparkClassroom.work.learn.Container',
    xtype: 'spark-teacher-work-learn',
    requires: [
        'Ext.data.ChainedStore',
        'SparkClassroom.work.FeedbackView',
        'SparkClassroomTeacher.view.work.learn.Sidebar'
    ],


    config: {
        allowToggleComplete: false,
    },


    initialize: function () {
        this.callParent(arguments);

        this.add([{
            docked: 'right',

            xtype: 'spark-teacher-work-learn-sidebar'
        },{
            xtype: 'spark-feedbackview',

            store: {
                type: 'chained',
                source: 'work.Feedback',
                filters: [{
                    property: 'phase',
                    value: 'learn'
                }]
            }
        }]);
    }
});