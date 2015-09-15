/*jslint browser: true, undef: true, laxcomma:true, unused: true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Work', {
    extend: 'Ext.app.Controller',


    routes: {
        'work': {
            rewrite: 'rewriteWork'
        },
    },

    refs: {
        workTabbar: 'spark-work-tabbar',
    },

    control: {
        'spark-student-navbar button#work': {
            tap: 'onNavWorkTap'
        },
        workTabbar: {
            activetabchange: 'onWorkTabChange'
        }
    },


    // route handlers
    rewriteWork: function() {
        var workTabBar = this.getWorkTabbar(),
            activeWorkTab = workTabBar && workTabBar.getActiveTab();

        return 'work/' + (activeWorkTab && activeWorkTab.getItemId() || 'learn');
    },


    // event handlers
    onNavWorkTap: function() {
        this.redirectTo('work');
    },

    onWorkTabChange: function(tabbar, activeTab) {
        this.redirectTo('work/' + activeTab.getItemId());
    }
});