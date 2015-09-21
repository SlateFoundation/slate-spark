/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Activity', {
    extend: 'Ext.app.Controller',

    views: [
        'activity.Container',
        'ActivityList@SparkClassroom.activity'
    ],

    stores: ['Activities@SparkClassroom.store'],

    refs: {
        navBar: 'spark-student-navbar',
        activityNavButton: 'spark-student-navbar button#activity',

        activityCt: {
            selector: 'spark-activity',
            autoCreate: true,

            xtype: 'spark-activity'
        }
    },

    control: {
        activityNavButton: {
            tap: 'onNavActivityTap'
        }
    },

    // event handlers
    onNavActivityTap: function(btn) {
        this.getNavBar().toggleSubpanel(this.getActivityCt(), btn);
    }
});