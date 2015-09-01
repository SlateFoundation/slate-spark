/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',

    refs:{
        teacherTabBar: 'spark-teacher-tabbar'
    },
    
    control: {
        teacherTabBar: {
            activetabchange: 'onTeacherTabChange'
        }
    },

    onTeacherTabChange: function(tabBar, value, oldValue) {
        
        // TODO: handle when this gets triggered via setActiveTab from any controller
        this.redirectTo(value.getItemId());
        
    }

});