/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-teacher-assign-tabbar',

    config: {
        cls: 'spark-work-tabbar',
        defaults: {
            flex: 1
        },
        items: [
            {
                title: 'Learn &amp; Practice',
                itemId: 'learn'
            },
            {
                title: 'Conference Questions',
                itemId: 'conference-questions'
            },
            {
                title: 'Conference Resources',
                itemId: 'conference-resources'
            },
            {
                title: 'Apply',
                itemId: 'apply'
            },
            {
                title: 'Assess',
                itemId: 'assess'
            }
        ]
    }
});
