/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.tabs.StudentWork', {
    extend: 'Ext.Container',
    xtype: 'spark-gps-tabs-studentwork',

    config: {
        title: 'Student Work',
        height: 500,
        layout: 'fit',
        items: [
            {
                xtype: 'tabpanel',
                activeItem: 1,
                items: [
                    {
                        title: 'Chistopher A.'
                    },
                    {
                        title: 'Alexandra W.',
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'tabpanel',
                                defaults: {
                                    styleHtmlContent: true
                                },
                                items: [
                                    {
                                        title: 'Learn &amp; Practice',
                                        html: 'stuff goes here '
                                    },
                                    {
                                        title: 'Conference',
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
                    },
                    {
                        title: 'Lucy D.'
                    },
                    {
                        title: 'Trevor K.'
                    }
                ]
            }
        ]
    }
});