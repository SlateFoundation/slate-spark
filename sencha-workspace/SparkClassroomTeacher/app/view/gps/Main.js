/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-gps',
    cls: 'spark-gps',
    requires: [
        'SparkClassroom.NavBar',
        'SparkClassroomTeacher.view.gps.StudentList'
    ],

    config: {
        items: [
            {
                xtype: 'spark-navbar'
            },
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
                            xtype: 'spark-gps-studentList',
                            grouped: true,
                            flex: 1
                        },
                        items: [
                            {
                                store: 'gps.Learn',
                                itemId: 'learnList',
                                title: 'Learn and Practice <span class="count">5</span>'
                            },
                            {
                                store: 'gps.Conference',
                                itemId: 'conferenceList',
                                title: 'Conference <span class="count">9</span>'
                            },
                            {
                                store: 'gps.Apply',
                                itemId: 'applyList',
                                title: 'Apply <span class="count">8</span>'
                            },
                            {
                                store: 'gps.Assess',
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
                                xtype: 'spark-gps-studentList',
                                store: 'gps.Priorities',
                                title: 'Priorities <span class="count">23</span>'
                            },
                            {
                                xtype: 'spark-gps-studentList',
                                store: 'gps.Help',
                                grouped: true
                            }
                        ]
                    }
                ]
                
            }
        ]
    },
    
    initialize: function () {
        var me = this,
        componentList = {
            Learn: 'learnList',
            Conference: 'conferenceList',
            Apply: 'applyList',
            Assess: 'assessList'
        }, store, list;

        me.callParent(arguments);

        for (var key in componentList) {
            list = me.down('spark-gps-studentList[itemId='+componentList[key]+']');    
            store = list.getStore();
            
            store.group('GPSStatusGroup');
            
        }
    }
});