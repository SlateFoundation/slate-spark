/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-assign-ct',
    requires: [
        'SparkClassroomTeacher.view.assign.TabBar'
    ],

    config: {
        autoDestroy: false,
        items: [
            {
                docked: 'top',
                xtype: 'formpanel',
                cls: 'content-card-inline',
                margin: 0,
                items: [
                    {
                        xtype: 'selectfield',
                        options: [
                            {
                                text: 'BIO1-009',
                                value: ''
                            }
                        ]
                    }
                ]
            },
            {
                docked: 'top',
                xtype: 'spark-teacher-assign-tabbar'
            }
        ]
    }
});