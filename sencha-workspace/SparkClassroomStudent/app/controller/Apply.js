/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Apply', {
    extend: 'Ext.app.Controller',
 
     views: [
        'work.apply.Container' 
    ],

    refs: {
        workTabbar: 'spark-work-tabbar',
        tabsCt: {
            selector: 'spark-student-tabscontainer',
            autoCreate: true,

            xtype: 'spark-student-tabscontainer'
        },
        applyCt: {
            selector: 'spark-student-work-apply',
            autoCreate: true,

            xtype: 'spark-student-work-apply'
        }
    },

    routes: {
        'apply': 'showApply'
    },

    // route handlers
    showApply: function() {
        this.doHighlightTabbars();
        this.doShowApplyContainer();
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
    doShowApplyContainer: function() {
        var workCt = this.getTabsCt();
        
        workCt.removeAll();
        workCt.add(this.getApplyCt());
    }

});