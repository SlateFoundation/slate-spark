/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.learn.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-teacher-work-learn-form',
    requires: [
        'Ext.field.Number',
        'SparkClassroom.work.learn.ProgressBanner'
    ],

    config: {
        items: [
            {
                // TODO: hide/remove progress banner from grid
                xtype: 'spark-work-learn-progressbanner',
                data: {
                    name: 'Alexandra W.',
                    completedLearns: 3,
                    requiredLearns: 5
                }
            },
            {
                xtype: 'formpanel',
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
            }
        ]
    }
});