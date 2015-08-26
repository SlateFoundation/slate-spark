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
                section: 'learn'
            },
            {
                title: 'Conference Questions',
                section: 'conference-questions'
            },
            {
                title: 'Conference Resources',
                section: 'conference-resources'
            },
            {
                title: 'Apply',
                section: 'apply'
            },
            {
                title: 'Assess',
                section: 'assess'
            }
        ]
    }
});
