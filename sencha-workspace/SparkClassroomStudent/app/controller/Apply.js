/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Apply', {
    extend: 'Ext.app.Controller',

    views: [
        'work.apply.Container'
    ],

    refs: {
        tabsCt: 'spark-student-tabscontainer',
        workTabbar: 'spark-work-tabbar',

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
        var workCt = this.getTabsCt();

        this.doHighlightTabbars('apply');

        workCt.removeAll();
        workCt.add(this.getApplyCt());
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