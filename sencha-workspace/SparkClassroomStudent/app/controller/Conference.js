/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Conference', {
    extend: 'Ext.app.Controller',
 
     views: [
        'work.conference.Container' 
    ],

    refs: {
        workTabbar: 'spark-work-tabbar',
        tabsCt: {
            selector: 'spark-student-tabscontainer',
            autoCreate: true,

            xtype: 'spark-student-tabscontainer'
        },
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
        this.doHighlightTabbars();
        this.doShowConferenceContainer();
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
    doShowConferenceContainer: function() {
        var workCt = this.getTabsCt();
        
        workCt.removeAll();
        workCt.add(this.getConferenceCt());
    }

});