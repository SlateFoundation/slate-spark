/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-teacher-work-conference-form',
    requires: [
        'SparkClassroom.work.Timer',
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight'
    ],

    config: {
        items: [
            {
                xtype: 'container',
                margin: '16 0',
                items: [
                    {
                        xtype: 'button',
                        ui: 'action',
                        text: 'Start a Conference'
                    },
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
                                store: {
                                    fields: [ 'members' ],
                                    data: [
                                        {
                                            members: [
                                                'Tiffany To',
                                                'Alfonso Albert',
                                                'Bev Banton'
                                            ]
                                        },
                                        {
                                            members: [
                                                'Laree Li'
                                            ]
                                        },
                                        {
                                            members: [
                                                'Sammy Schlata',
                                                'Mottie McClenton'
                                            ]
                                        }
                                    ]
                                },
                                itemCls: 'spark-conference-listing',
                                itemTpl: [
                                    '<ul class="spark-conference-member-list">',
                                        '<tpl for="members"><li class="spark-conference-member-item">{.}</li></tpl>',
                                    '</ul>',
                                    '<button class="primary small spark-conference-join-btn">Join</button>'
                                ]
                            }
                        ]
                    }
                ]
            },
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
                xtype: 'grid',
                cls: 'sidebar-grid',
                plugins: [
                    'gridflex',
                    'gridheight'
                ],
                titleBar: null,
                items: [
                    {
                        docked: 'bottom',
                        xtype: 'container',
                        padding: '8 10 8 18',
                        items: [
                            {
                                xtype: 'selectfield',
                                placeHolder: 'Add a student…',
                            }
                        ]
                    }
                ],
                store: {
                    fields: [ 'name', 'feedbackLeft', 'ready' ],
                    data: [
                        { name: 'Tiffany To',       feedbackLeft: 0,    ready: true },
                        { name: 'Alfonso Albert',   feedbackLeft: 1,    ready: false },
                        { name: 'Bev Banton',       feedbackLeft: 0,    ready: false },
                        { name: 'Laree Li',         feedbackLeft: 0,    ready: false },
                        { name: 'Sammy Schlata',    feedbackLeft: 0,    ready: false },
                        { name: 'Mottie McClenton', feedbackLeft: 0,    ready: false }
                    ]
                },
                columns: [
                    {
                        flex: 1,
                        dataIndex: 'name',
                        text: 'Student'
                    },
                    {
                        width: 80,
                        dataIndex: 'feedbackLeft',
                        text: 'Feedback Left',
                        align: 'center',
                        cell: { encodeHtml: false, align: 'center' },
                        tpl: '<tpl if="feedbackLeft">{feedbackLeft}<tpl else>&mdash;</tpl>'
                    },
                    {
                        width: 80,
                        text: 'Mastery Score',
                        align: 'center',
                        cell: { encodeHtml: false, align: 'center' },
                        tpl: '<input class="field-control text-center" placeholder="/" style="width: 100%">'
                    },
                    {
                        width: 64,
                        dataIndex: 'ready',
                        text: 'Ready',
                        align: 'center',
                        cell: { encodeHtml: false, align: 'center' },
                        tpl: '<tpl if="ready"><i class="fa fa-check"></i><tpl else>&mdash;</tpl>'
                    },
                    {
                        width: 48,
                        cell: { encodeHtml: false, align: 'center' },
                        tpl: '<i class="fa fa-times-circle"></i>',
                    }
                ]
            },
            {
                xtype: 'spark-panel',
                cls: 'content-card narrow',
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
                        xtype: 'button',
                        margin: '16 0 0',
                        ui: 'action',
                        iconCls: 'fa fa-send',
                        text: 'Leave feedback for 2 students'
                    }
                ]
            },
            {
                xtype: 'button',
                ui: 'action',
                text: 'Mark 2 students ready for Apply &rarr;'
            }
        ]
    }
});