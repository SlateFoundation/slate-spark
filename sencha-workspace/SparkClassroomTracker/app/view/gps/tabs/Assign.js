/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.tabs.Assign', {
    extend: 'Ext.Container',
    xtype: 'spark-gps-tabs-assign',

    config: {
        title: 'Assign SparkPoints',
        layout: 'fit',
        items: [
            {
                xtype: 'tabpanel',
                items: [
                    {
                        title: 'Learn &amp; Practice',
                        html: 'stuff goes here '
                    },
                    {
                        title: 'Conference Questions',
                        html: 'stuff goes here '
                    },
                    {
                        title: 'Conference Resources',
                        html: 'stuff goes here '
                    },
                    {
                        title: 'Apply',
                        html: 'stuff goes here '
                    },
                    {
                        title: 'Assess',
                        html: 'stuff goes here '
                    }
                ]
            }
        ]
    }
});