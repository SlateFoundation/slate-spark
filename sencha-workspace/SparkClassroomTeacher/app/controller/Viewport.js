/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',

    stores: [
        'Sections@SparkClassroom.store'
    ],

    refs:{
        teacherTabBar: 'spark-teacher-tabbar',
        workTabBar: 'spark-work-tabbar',
        assignTabBar: 'spark-teacher-assign-tabbar',
        sparkNavBarButtons: 'spark-navbar button'
    },
    
    control: {
        teacherTabBar: {
            activetabchange: 'onTeacherTabChange'
        },
        sparkNavBarButtons: {
            tap: 'onSparkNavBarButtonClick'
        }
    },

    onTeacherTabChange: function(tabBar, value, oldValue) {
        this.redirectTo(value.getItemId());      
    },

    onSparkNavBarButtonClick: function(btn) {
        this.redirectTo(btn.getItemId());
    }

});