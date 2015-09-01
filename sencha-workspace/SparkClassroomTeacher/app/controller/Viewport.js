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
        var me =  this,
            section = value.getItemId();

        // TODO: handle when this gets triggered via setActiveTab from any controller
        switch(section){
            case 'work':
                var workTabBar = me.getWorkTabBar();
                if(workTabBar === undefined){
                    this.redirectTo(section);
                } else {
                    this.redirectTo(section + '/' +  workTabBar.getActiveTab().getItemId());
                }
                break;
            case 'competencies':
                this.redirectTo(value.getItemId());
                break;
            case 'assign':
                var assignTabBar = me.getAssignTabBar();
                if(assignTabBar === undefined){
                    this.redirectTo(section);
                } else {
                    this.redirectTo(section + '/' +  assignTabBar.getActiveTab().getItemId());
                }
                break;
        }
        
    }

});