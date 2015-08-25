/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-teacher-assign-tabbar',

    config: {
        items: [
            {
                title: 'Learn &amp; Practice',
                section: 'learn'
            },
            {
                title: 'Confence Questions',
                section: 'conference-questions'
            },
            {
                title: 'Confence Resources',
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
