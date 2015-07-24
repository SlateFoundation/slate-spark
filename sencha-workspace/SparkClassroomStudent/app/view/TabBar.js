/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-tabbar',

    config: {
        layout: {
            type: 'hbox',
            pack: 'center'
        },

        items: [
            {
                title: 'Learn &amp; Practice',
                section: 'learn'
            },
            {
                title: 'Conference',
                section: 'conference'
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