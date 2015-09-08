/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Assess', {
    extend: 'Ext.app.Controller',
 
     views: [
        'work.assess.Container' 
    ],

    refs: {
        workTabbar: 'spark-work-tabbar',
        tabsCt: {
            selector: 'spark-student-tabscontainer',
            autoCreate: true,

            xtype: 'spark-student-tabscontainer'
        },
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
        this.doHighlightTabbars();
        this.doShowAssessContainer();
    },

    //controller methods
    /**
     * @private
     * Called by each subsection route handler to highlight the proper tab
     */
    doHighlightTabbars: function(){
        var workTabbar = this.getWorkTabbar(),
            hash = Ext.util.History.getHash(),
            assignTab = workTabbar.down('#' + hash);

        workTabbar.setActiveTab(assignTab);
    },

    /**
     * @private
     * Called by each showLearn() to add the learnCt to the tabsCt
     */
    doShowAssessContainer: function() {
        var workCt = this.getTabsCt();
        
        workCt.removeAll();
        workCt.add(this.getAssessCt());
    }

});