/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.Form', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-conference-form',

    config: {
        items: [
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        flex: 1,
                        xtype: 'component',
                        html: 'timer'
                    },
                    {
                        xtype: 'button',
                        ui: 'action',
                        text: 'Pause Conference'
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
                            },
                            {
                                xtype: 'fieldset',
                                cls: 'radio-group text-notrail',
                                title: 'To',
                                defaults: {
                                    labelAlign: 'left',
                                    labelWidth: 'auto',
                                    name: 'to'
                                },
                                items: [
                                    {
                                        xtype: 'radiofield',
                                        label: 'Alexandra W'
                                    },
                                    {
                                        xtype: 'radiofield',
                                        label: 'Current Standard'
                                    },
                                    {
                                        xtype: 'radiofield',
                                        label: 'All in group'
                                    },
                                    {
                                        xtype: 'radiofield',
                                        label: 'All in Conference'
                                    }
                                ]
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
            {
                xtype: 'formpanel',
                cls: 'content-card narrow',
                items: [
                    {
                        // TODO input mask?
                        xtype: 'textfield',
                        label: 'Mastery Check Score',
                        labelAlign: 'left',
                        labelCls: 'text-left',
                        labelWidth: '10.5em',
                        placeHolder: ' / ',
                        style: { textAlign: 'center' },
                    }
                ]
            },
            {
                xtype: 'button',
                ui: 'action',
                text: 'Alexandra W. is Ready for Apply'
            }
        ]
    }
});