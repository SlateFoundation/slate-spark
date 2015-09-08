/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Learn', {
    extend: 'Ext.app.Controller',
 
     views: [
        'work.learn.Container' 
    ],

    refs: {
        tabsCt: {
            selector: 'spark-student-tabscontainer',
            autoCreate: true,

            xtype: 'spark-student-tabscontainer'
        },
        workTabbar: 'spark-work-tabbar',  
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
        var workCt = this.getTabsCt();

        this.doHighlightTabbars();
                
        workCt.removeAll();
        workCt.add(this.getLearnCt());
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