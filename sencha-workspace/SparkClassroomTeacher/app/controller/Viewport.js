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
        
        //if(oldValue !== null){
            this.redirectTo(value.getItemId());
        //}

    }

});