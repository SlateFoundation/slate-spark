/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-gps',
    requires: [
        'SparkClassroomTeacher.view.gps.StudentList'
    ],

    config: {
        items: [
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        flex: 1,
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'spark-gps-studentList',
                                grouped: true,
                                store: 'gps.Learn',
                                itemId: 'learnList',
                                flex: 1,
                                title: 'Learn and Practice'
                            },
                            {
                                xtype: 'spark-gps-studentList',
                                grouped: true,
                                store: 'gps.Conference',
                                itemId: 'conferenceList',
                                flex: 1,
                                title: 'Conference'
                            },
                            {
                                xtype: 'spark-gps-studentList',
                                grouped: true,
                                store: 'gps.Apply',
                                itemId: 'applyList',
                                flex: 1,
                                title: 'Apply'
                            },
                            {
                                xtype: 'spark-gps-studentList',
                                grouped: true,
                                store: 'gps.Assess',
                                itemId: 'assessList',
                                flex: 1,
                                title: 'Assess'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        width: '35%',
                        items: [
                            {
                                xtype: 'spark-gps-studentList',
                                store: 'gps.Priorities',
                                title: 'Priorities'
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