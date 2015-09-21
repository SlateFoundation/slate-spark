/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.activity.Container', {
    extend: 'SparkClassroom.NavSubpanel',
    xtype: 'spark-activity',
    requires: [
        'SparkClassroom.activity.ActivityList'
    ],

    config: {
        width: 288,
        items: [
            {
                xtype: 'spark-activity-list'
            }
        ]
    }
});