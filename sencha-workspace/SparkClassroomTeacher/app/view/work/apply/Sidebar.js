Ext.define('SparkClassroomTeacher.view.work.apply.Sidebar', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-apply-sidebar',

    config: {
        items: [
            {
                xtype: 'formpanel',
                cls: 'content-card narrow',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Feedback',
                        items: [
                            {
                                xtype: 'textfield',
                                label: 'Subject'
                            },
                            {
                                xtype: 'textareafield',
                                label: 'Message'
                            // },
                            // {
                            //     xtype: 'fieldset',
                            //     cls: 'radio-group text-notrail',
                            //     title: 'To',
                            //     defaults: {
                            //         labelAlign: 'left',
                            //         labelWidth: 'auto',
                            //         name: 'to'
                            //     },
                            //     items: [
                            //         {
                            //             xtype: 'radiofield',
                            //             label: 'Alexandra W'
                            //         },
                            //         {
                            //             xtype: 'radiofield',
                            //             label: 'Current Standard'
                            //         },
                            //         {
                            //             xtype: 'radiofield',
                            //             label: 'All in group'
                            //         },
                            //         {
                            //             xtype: 'radiofield',
                            //             label: 'All in Conference'
                            //         }
                            //     ]
                            }
                        ]
                    },
                    {
                        xtype: 'button',
                        ui: 'action',
                        text: 'Log'
                    }
                ]
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
                ]
            },
            {
                xtype: 'button',
                ui: 'action',
                text: 'Assess &rarr;'
            },
            {
                cls: 'hint text-center',
                margin: '8 0 0',
                html: 'Confirm Alexandra W. is ready for assess.'
            }
        ]
    }
});