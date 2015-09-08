/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Learn', {
    extend: 'Ext.app.Controller',
 
     views: [
        'work.learn.Container' 
    ],

    refs: {
        workTabbar: 'spark-work-tabbar',
        tabsCt: {
            selector: 'spark-student-tabscontainer',
            autoCreate: true,

            xtype: 'spark-student-tabscontainer'
        },  
        learnCt: {
            selector: 'spark-student-work-learn',
            autoCreate: true,

            xtype: 'spark-student-work-learn'
        }
    },

    routes: {
        'learn': 'showLearn'
    },

    // route handlers
    showLearn: function() {
        this.doHighlightTabbars();
        this.doShowLearnContainer();
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
    doShowLearnContainer: function() {
        var workCt = this.getTabsCt();
        
        workCt.removeAll();
        workCt.add(this.getLearnCt());
    }

});