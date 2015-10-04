/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-gps',
    cls: 'spark-gps',
    requires: [
        'SparkClassroomTeacher.view.gps.StudentList'
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
                        xtype: 'container',
                        flex: 4,
                        cls: 'spark-gps-studentlist-group',
                        layout: 'hbox',
                        defaults: {
                            xtype: 'spark-gps-studentlist',
                            //grouped: true,
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
                        cls: 'spark-gps-studentlist-group',
                        flex: 2,
                        items: [
                            {
                                itemId: 'priorityList',

                                xtype: 'spark-gps-studentlist',
                                store: 'gps.Priorities',
                                title: 'Priorities'
                            },
                            {
                                itemId: 'addPriorityBtn',

                                xtype: 'button',
                                tpl: 'Add {[values.student.get("FullName")]}',
                                hidden: true
                            },
                            {
                                itemId: 'helpList',

                                xtype: 'spark-gps-studentlist',
                                store: 'gps.Help',
                                title: 'Help'
                                //grouped: true
                            }
                        ]
                    }
                ]

            }
        ]
    }
});