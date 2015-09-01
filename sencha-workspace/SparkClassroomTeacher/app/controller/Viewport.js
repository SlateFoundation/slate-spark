/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',

    stores: [
        'Sections@SparkClassroom.store'
    ],

    refs:{
        teacherTabBar: 'spark-teacher-tabbar',
        workTabBar: 'spark-work-tabbar',
        assignTabBar: 'spark-teacher-assign-tabbar'
    },
    
    control: {
        teacherTabBar: {
            activetabchange: 'onTeacherTabChange'
        }
    },

    onTeacherTabChange: function(tabBar, value, oldValue) {
        this.redirectTo(value.getItemId());        
    }

});