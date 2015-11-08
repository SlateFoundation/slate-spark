Ext.define('SparkClassroomTeacher.view.work.apply.Sidebar', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-apply-sidebar',
    requires: [
        'SparkClassroomTeacher.view.FeedbackForm'
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
                xtype: 'spark-panel',
                title: 'Grade the Apply',
                data: {
                    items: [ 0, 1, 2, 3, 4 ]
                },
                tpl: [
                    '<div class="number-line-picker">',
                        '<div class="number-line-track"></div>',
                        '<div class="number-line-track-filler"></div>',
                        '<ul class="number-line-items">',
                            '<tpl for="items">',
                                '<li class="number-line-item"><a href="#" class="number-line-target {[xindex < 3 ? "is-filled" : ""]}">{[xindex - 1]}</a></li>',
                            '</tpl>',
                        '</ul>',
                    '</div>'
                ],
                listeners: {
                    element: 'element',
                    click: function(ev, t) {
                        ev.stopEvent();
                        Ext.Msg.alert('Not implemented', 'Grading applies is not curently available, check back soon');
                    }
                }
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