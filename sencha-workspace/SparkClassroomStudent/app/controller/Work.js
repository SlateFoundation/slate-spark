/*jslint browser: true, undef: true, laxcomma:true, unused: true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Work', {
    extend: 'Ext.app.Controller',


    routes: {
        'work': {
            rewrite: 'rewriteWork'
        },
    },

    refs: {
        navBar: 'spark-student-navbar',
        workNavButton: 'spark-student-navbar button#work',
        workTabbar: 'spark-work-tabbar',
    },

    control: {
        workNavButton: {
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
        var me = this;

        me.redirectTo('work/' + activeTab.getItemId());
        me.getNavBar().setSelectedButton(me.getWorkNavButton());
    }
});