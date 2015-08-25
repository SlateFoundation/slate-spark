/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-assign-ct',
    requires: [
        'SparkClassroomTeacher.view.assign.TabBar'
    ],

    config: {
        autoDestroy: false,
        // TODO: copied from 'SparkClassroomTeacher.view.TabsContainer' are they 
        // 		 appropriate for this sub view styling?
        //baseCls: 'spark-teacher-tabscontainer',
        //padding: '48 24', // TODO: shouldn't this be in SASS?
        items: [
            {
                docked: 'top',

                xtype: 'spark-teacher-assign-tabbar'
            }
        ]
    }
});