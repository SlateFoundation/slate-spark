/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * The Competencies controller handles activating the top-level
 * "Competency Overview" tab and manages all UI within it
 *
 * ## Responsibilities
 * - Realize /competencies route
 * - Ensure "Competency Overview" tab is selected in navbar and
 * teacher tabs when screen gets activated
 */
Ext.define('SparkClassroomTeacher.controller.Competencies', {
    extend: 'Ext.app.Controller',

    views: [
        'competencies.Container'
    ],

    refs:{
        navBar: 'spark-navbar',
        competenciesNavButton: 'spark-navbar button#competencies',

    	tabsCt: 'spark-teacher-tabscontainer',
        teacherTabbar: 'spark-teacher-tabbar',

    	competenciesCt: {
            selector: 'spark-competencies',
            autoCreate: true,

            xtype: 'spark-competencies'
        }
    },

    control: {
        competenciesNavButton: {
            tap: 'onNavCompetenciesTap'
        },
        competenciesCt: {
            activate: 'onCompetenciesCtActivate'
        }
    },

    routes: {
      	'competencies': 'showCompetencies'
    },


    // route handlers
    showCompetencies: function() {
        var tabsCt = this.getTabsCt();

        this.doHighlightTabbars();

        tabsCt.removeAll();
        tabsCt.add(this.getCompetenciesCt());
    },


    // event handlers
    onNavCompetenciesTap: function() {
        this.redirectTo('competencies');
    },

    onCompetenciesCtActivate: function() {
        this.getNavBar().setSelectedButton(this.getCompetenciesNavButton());
    },


    // controller methods
    /**
     * @private
     * highlights proper section in the spark teacher tabbar
     */
    doHighlightTabbars: function(section) {
        var teacherTabbar = this.getTeacherTabbar(),
            teacherTab = teacherTabbar.down('#competencies');

        teacherTabbar.setActiveTab(teacherTab);
    }
});