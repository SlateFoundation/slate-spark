/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.Feedback', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-conference-feedback',
    requires: [
        'SparkClassroom.work.Timer',
        'SparkClassroomTeacher.view.work.conference.StudentsGrid'
    ],

    config: {
        items: [
            {
                itemId: 'waitingCt',

                xtype: 'container',
                hidden: true,
                margin: '16 0',
                items: [
                    {
                        itemId: 'startConferenceBtn',

                        xtype: 'button',
                        ui: 'action',
                        text: 'Start a Conference'
                    },
                    {
                        itemId: 'joinConferenceCt',

                        xtype: 'container',
                        hidden: true,
                        items: [
                            {
                                cls: 'or-separator',
                                html: '<span class="text">or</span>'
                            },
                            {
                                xtype: 'spark-panel',
                                cls: 'content-card narrow',
                                title: 'Join a Conference:',
                                items: [
                                    {
                                        xtype: 'dataview',
                                        store: 'work.ConferenceGroups',
                                        itemCls: 'spark-conference-listing',
                                        itemTpl: [
                                            '<ul class="spark-conference-member-list">',
                                                '<tpl for="members">',
                                                    '<li class="spark-conference-member-item">{[values.get("student").get("FullName")]}</li>',
                                                '</tpl>',
                                            '</ul>',
                                            '<button class="primary small spark-conference-join-btn">Join #{id}</button>'
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                itemId: 'conferencingCt',

                xtype: 'container',
                hidden: true,
                margin: '16 0',
                items: [
                    {
                        xtype: 'container',
                        margin: '16 0',
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                            {
                                flex: 1,
                                xtype: 'spark-work-timer',
                                data: { time: '5:45' },
                                margin: '0 16 0 0'
                            },
                            {
                                flex: 1,
                                xtype: 'button',
                                ui: 'action',
                                text: 'Pause Conference'
                            }
                        ]
                    },
                    {
                        xtype: 'spark-teacher-work-conference-studentsgrid',
                        cls: 'sidebar-grid'
                    },
                    {
                        xtype: 'spark-panel',
                        cls: 'content-card narrow',
                        title: 'Feedback',
                        items: [
                            {
                                itemId: 'feedbackSubjectField',

                                xtype: 'textfield',
                                label: 'Subject'
                            },
                            {
                                itemId: 'feedbackMessageField',

                                xtype: 'textareafield',
                                label: 'Message'
                            },
                            {
                                itemId: 'feedbackBtn',

                                xtype: 'button',
                                margin: '16 0 0',
                                ui: 'action',
                                iconCls: 'fa fa-send',
                                disabled: true,
                                text: 'Select students to leave feedback'
                            }
                        ]
                    },
                    {
                        itemId: 'readyBtn',

                        xtype: 'button',
                        ui: 'action',
                        disabled: true,
                        text: 'Select students to mark ready for Apply &rarr;'
                    }
                ]
            }
        ]
    }
});