/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Conference', {
    extend: 'Ext.app.Controller',
 
     views: [
        'work.conference.Container' 
    ],

    refs: {
        tabsCt: {
            selector: 'spark-student-tabscontainer',
            autoCreate: true,

            xtype: 'spark-student-tabscontainer'
        },
        workTabbar: 'spark-work-tabbar',
        conferenceCt: {
            selector: 'spark-student-work-conference',
            autoCreate: true,

            xtype: 'spark-student-work-conference'
        }
    },

    routes: {
        'conference': 'showConference'
    },

    // route handlers
    showConference: function() {
        var workCt = this.getTabsCt();

        this.doHighlightTabbars();        
        
        workCt.removeAll();
        workCt.add(this.getConferenceCt());
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