/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-assign-points-tabbar',

    config: {
        items: [
            {
                title: 'Learn &amp; Practice',
                section: 'learn'
            },
            {
                title: 'Confence Resources',
                section: 'resourcegrid'
            },
            {
                title: 'Confence Questions',
                section: 'questiongrid'
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