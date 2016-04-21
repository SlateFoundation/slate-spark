Ext.define('SparkClassroomTeacher.view.work.learn.Sidebar', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-learn-sidebar',
    requires: [
        'Ext.field.Number',
        'SparkClassroom.work.learn.ProgressBanner',
        'SparkClassroomTeacher.view.FeedbackForm'
    ],

    config: {
        cls: 'sidebar-col',
        items: [
            {
                // TODO: hide/remove progress banner from grid
                xtype: 'spark-work-learn-progressbanner',
                hidden: true
            },
            {
                xtype: 'formpanel',
                cls: 'content-card narrow',
                items: [
                    {
                        itemId: 'masteryCheckScoreField',

                        xtype: 'numberfield',
                        label: 'Mastery Check Score',
                        labelAlign: 'left',
                        labelCls: 'text-left',
                        labelWidth: '10.5em',
                        inputCls: 'input-mastery-score',
                        minValue: 0,
                        maxValue: 100,
                        maxLength: 3,
                        stepValue: 1,
                        clearIcon: false,
                        placeHolder: '95',
                        style: { textAlign: 'center' }
                    }
                ]
            },
            {
                xtype: 'spark-teacher-feedbackform'
            }
        ]
    }
});