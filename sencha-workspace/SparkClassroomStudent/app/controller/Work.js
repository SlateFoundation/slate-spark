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
            tap: 'onNavWorkClick'
        },
        workTabbar: {
            activetabchange: 'onWorkTabChange'
        }
    },


    // route handlers
    rewriteWork: function() {
        debugger;
        var workTabBar = this.getWorkTabbar();

        return 'work/' + (workTabBar && workTabBar.getActiveTab().getItemId() || 'learn');
    },


    // event handlers
    onNavWorkClick: function() {
        debugger;
        this.redirectTo('work');
    },

    onWorkTabChange: function(tabbar, activeTab) {
        this.redirectTo('work/' + activeTab.getItemId());
    }
});