/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-gps',
    requires: [
        'SparkClassroomTeacher.view.gps.Header',
        'SparkClassroomTeacher.view.gps.StudentList'
    ],

    config: {
        items: [
            {
                xtype: 'spark-gps-header'
            },
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
                                itemId: 'learnList',
                                flex: 1
                            },
                            {
                                xtype: 'spark-gps-studentList',
                                itemId: 'conferenceList',
                                flex: 1
                            },
                            {
                                xtype: 'spark-gps-studentList',
                                itemId: 'applyList',
                                flex: 1
                            },
                            {
                                xtype: 'spark-gps-studentList',
                                itemId: 'assessList',
                                flex: 1
                            }
                        ]
                    },
                    {
                        xtype: 'spark-gps-studentList',
                        flex: 1
                    }
                ]
                
            }
        ]
    },
    
    initialize: function () {
        var me = this,
        list = {
            Learn: 'learnList',
            Conference: 'conferenceList',
            Apply: 'applyList',
            Assess: 'assessList'
        }, store;
        
        me.callParent(arguments);
        
        for (var key in list) {
            store = me.down('spark-gps-studentList[itemId='+list[key]+']').getStore();
            
            me.down('spark-gps-studentList[itemId='+list[key]+']').getStore().filter({
                filterFn: function(item) {
                    return item.get('Level') == key;
                }
            });
            
            store.setGrouper({
                property: 'Status'
            });
            
            store.group('Status');
        }
    }
});