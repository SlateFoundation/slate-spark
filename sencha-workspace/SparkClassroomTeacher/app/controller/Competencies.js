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
        }
    },

    routes: {
      	'competencies': 'showCompetencies'
    },

    // route handlers
    showCompetencies: function(){
    	this.doShowContainer();
    },

    // event handlers


	// controller methods
    /**
     * @private
     * Called by each subsection route handler to ensure container is activated
     */
    doShowContainer: function() {
        var tabsCt = this.getTabsCt();
        
        tabsCt.removeAll();
        tabsCt.add(this.getCompetenciesCt());
    }

});
