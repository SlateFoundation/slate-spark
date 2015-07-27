/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.work.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work',

    config: {
        layout: 'vbox',
        title: 'Student Work',
        items: [
            {
                xtype: 'tabbar',
                activeTab: 1,
                userClass: 'Teacher',
                items: [
                    {
                        title: 'Chistopher A.'
                    },
                    {
                        title: 'Alexandra W.'                   
                    },
                    {
                        title: 'Lucy D.'
                    },
                    {
                        title: 'Trevor K.'
                    }
                ]
            },
            {
                xtype: 'tabbar',
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
        ]
    }
});