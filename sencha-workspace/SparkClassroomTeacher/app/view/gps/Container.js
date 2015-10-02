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
                                store: 'Learn',
                                itemId: 'learnList',
                                title: 'Learn and Practice <span class="count">5</span>'
                            },
                            {
                                store: 'Conference',
                                itemId: 'conferenceList',
                                title: 'Conference <span class="count">9</span>'
                            },
                            {
                                store: 'Apply',
                                itemId: 'applyList',
                                title: 'Apply <span class="count">8</span>'
                            },
                            {
                                store: 'Assess',
                                itemId: 'assessList',
                                title: 'Assess <span class="count">8</span>'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        cls: 'spark-gps-studentlist-group',
                        flex: 2,
                        items: [
                            {
                                xtype: 'container',
                                layout: 'fit',
                                items: [{
                                    xtype: 'spark-gps-studentlist',
                                    store: 'Priorities',
                                    itemId: 'priorityList',
                                    title: 'Priorities <span class="count">23</span>'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'priority-add',
                                    tpl: 'Add {Student.FullName}',
                                    hidden: true,
                                    docked: 'bottom'
                                }]
                            },
                            {
                                xtype: 'spark-gps-studentlist',
                                store: 'Help',
                                title: 'Help <span class="count">5</span>'
                                //grouped: true
                            }
                        ]
                    }
                ]

            }
        ]
    }
});