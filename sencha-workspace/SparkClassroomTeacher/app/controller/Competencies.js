/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Competencies', {
    extend: 'Ext.app.Controller',

    views: [
        'competencies.Container'
    ],

    refs:{
    	tabsCt: 'spark-teacher-tabscontainer',
    	competenciesCt: {
            selector: 'spark-competencies',
            autoCreate: true,

            xtype: 'spark-competencies'
        },
        teacherTabbar: 'spark-teacher-tabbar'
    },

    routes: {
      	'competencies': 'showCompetencies'
    },

    // route handlers
    showCompetencies: function(){
        var tabsCt = this.getTabsCt();

        this.doHighlightTabbars();
        
        tabsCt.removeAll();
        tabsCt.add(this.getCompetenciesCt());
    },

    // controller methods
    /**
     * @private
     * highlights proper section in the spark teacher tabbar
     */
    doHighlightTabbars: function(section){
        var teacherTabbar = this.getTeacherTabbar(),
            teacherTab = teacherTabbar.down('#competencies');

        teacherTabbar.setActiveTab(teacherTab); 
    }

});
