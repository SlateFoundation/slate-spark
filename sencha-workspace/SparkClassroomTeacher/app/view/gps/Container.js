/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-gps',
    cls: 'spark-gps',
    requires: [
        'SparkClassroomTeacher.view.gps.StudentList',
        'SparkClassroomTeacher.view.gps.Waitlist'
    ],

    config: {
        selectedStudent: null,
        items: [
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'start'
                },
                items: [
                    {
                        itemId: 'phasesCt',
                        xtype: 'container',
                        flex: 4,
                        cls: 'spark-gps-list-group',
                        layout: 'hbox',
                        defaults: {
                            xtype: 'spark-gps-studentlist',
                            grouped: true,
                            flex: 1
                        },
                        items: [
                            {
                                itemId: 'learnList',

                                store: 'gps.Learn',
                                title: 'Learn and Practice'
                            },
                            {
                                itemId: 'conferenceList',

                                store: 'gps.Conference',
                                title: 'Conference'
                            },
                            {
                                itemId: 'applyList',

                                store: 'gps.Apply',
                                title: 'Apply'
                            },
                            {
                                itemId: 'assessList',

                                store: 'gps.Assess',
                                title: 'Assess'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        cls: 'spark-gps-list-group',
                        flex: 1,
                        items: [
                            {
                                cls: 'spark-gps-studentlist spark-gps-priority-group',
                                itemId: 'priorityList',

                                xtype: 'spark-gps-studentlist',
                                store: 'gps.Priorities',
                                title: 'Priorities',
                                showDismissButton: true,
                                emptyText: 'Select a student to add to your priorities&nbsp;list.',
                                deferEmptyText: false
                            },
                            {
                                itemId: 'addPriorityBtn',

                                xtype: 'button',
                                cls: 'studentlist-add-btn',
                                iconCls: 'fa fa-plus-circle text-active',
                                tpl: 'Add {[values.student.get("FullName")]}',
                                hidden: true
                            },
                            {
                                itemId: 'helpList',

                                xtype: 'spark-waitlist',
                                title: 'Help',
                                emptyText: 'No open help&nbsp;requests',
                                deferEmptyText: false
                                //grouped: true
                            }
                        ]
                    }
                ]

            }
        ]
    }
});