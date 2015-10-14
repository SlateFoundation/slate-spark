/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.Feedback', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-conference-feedback',
    requires: [
        'Ext.data.ChainedStore',
        'SparkClassroom.work.Timer',
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight'
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
                        itemId: 'conferencingStudentsGrid',

                        xtype: 'grid',
                        cls: 'sidebar-grid',
                        plugins: [
                            'gridflex',
                            'gridheight'
                        ],
                        titleBar: null,
                        mode: 'MULTI',
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
                            type: 'chained',
                            source: 'gps.ActiveStudents',
                            filters: [{
                                property: 'conference_group',
                                value: 0
                            }]
                            // fields: [ 'name', 'feedbackLeft', 'ready' ],
                            // data: [
                            //     { name: 'Tiffany To',       feedbackLeft: 0,    ready: true },
                            //     { name: 'Alfonso Albert',   feedbackLeft: 1,    ready: false },
                            //     { name: 'Bev Banton',       feedbackLeft: 0,    ready: false },
                            //     { name: 'Laree Li',         feedbackLeft: 0,    ready: false },
                            //     { name: 'Sammy Schlata',    feedbackLeft: 0,    ready: false },
                            //     { name: 'Mottie McClenton', feedbackLeft: 0,    ready: false }
                            // ]
                        },
                        columns: [
                            {
                                flex: 1,
                                dataIndex: 'student_name',
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
                                sortable: false,
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