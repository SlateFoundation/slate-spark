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
                itemId: 'learn',

                title: 'Learn &amp; Practice'
            },
            {
                itemId: 'conference-questions',

                title: 'Conference Questions'
            },
            {
                itemId: 'conference-resources',

                title: 'Conference Resources'
            },
            {
                itemId: 'apply',

                title: 'Apply'
            },
            {
                itemId: 'assess',

                title: 'Assess',
                disabled: true
            }
        ]
    }
});
