Ext.define('SparkClassroomTeacher.view.work.apply.Sidebar', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-apply-sidebar',
    requires: [
        'SparkClassroomTeacher.view.FeedbackForm',
        'SparkClassroomTeacher.view.work.apply.GradePanel'
    ],


    config: {
        items: [
            {
                xtype: 'spark-teacher-feedbackform'
            },
            // {
            //     xtype: 'spark-panel',
            //     title: 'Grade the Apply',
            //     items: [
            //         {
            //             xtype: 'sliderfield',
            //             label: '3.C.C.4.A - Reading Critically',
            //             value: 0,
            //             minValue: 0,
            //             maxValue: 4,
            //             increment: 1
            //         }
            //     ]
            // },
            {
                xtype: 'spark-teacher-work-apply-gradepanel'
            },
            {
                itemId: 'readyForAssessBtn',

                xtype: 'button',
                ui: 'action',
                text: 'Assess &rarr;'
            },
            {
                itemId: 'readyHintCmp',

                cls: 'hint text-center',
                margin: '8 0 0',
                tpl: 'Confirm {student_name} is ready for assess.'
            }
        ]
    }
});