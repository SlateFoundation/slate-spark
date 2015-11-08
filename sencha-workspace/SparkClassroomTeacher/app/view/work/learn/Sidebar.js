/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.learn.Sidebar', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-learn-sidebar',
    requires: [
        'Ext.field.Number',
        'SparkClassroom.work.learn.ProgressBanner'
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
                disabled: true,
                cls: 'content-card narrow',
                items: [
                    {
                        xtype: 'numberfield',
                        label: 'Mastery Check Score',
                        labelAlign: 'left',
                        labelCls: 'text-left',
                        labelWidth: '10.5em',
                        inputCls: 'input-mastery-score',
                        minValue: 0,
                        maxValue: 100,
                        stepValue: 1,
                        clearIcon: false,
                        placeHolder: '95',
                        style: { textAlign: 'center' }
                    }
                ]
            },
            {
                xtype: 'formpanel',
                cls: 'content-card narrow',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Feedback',
                        items: [
                            {
                                xtype: 'textareafield',
                                label: 'Message'
                            }
                        ]
                    },
                    {
                        xtype: 'button',
                        ui: 'action',
                        text: 'Log'
                    }
                ]
            }
        ]
    }
});