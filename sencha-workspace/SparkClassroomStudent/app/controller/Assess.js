/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Assess', {
    extend: 'Ext.app.Controller',

    views: [
        'work.assess.Container'
    ],

    refs: {
        tabsCt: 'spark-student-tabscontainer',
        workTabbar: 'spark-work-tabbar',

        assessCt: {
            selector: 'spark-student-work-assess',
            autoCreate: true,

            xtype: 'spark-student-work-assess'
        }
    },

    routes: {
        'assess': 'showAssess'
    },

    // route handlers
    showAssess: function() {
        var workCt = this.getTabsCt();

        this.doHighlightTabbars('assess');

        workCt.removeAll();
        workCt.add(this.getAssessCt());
    },

    //controller methods
    /**
     * @private
     * Called by each subsection route handler to highlight the proper tab
     */
    doHighlightTabbars: function(section){
        var workTabbar = this.getWorkTabbar(),
            assignTab = workTabbar.down('#' + section);

        workTabbar.setActiveTab(assignTab);
    }

});