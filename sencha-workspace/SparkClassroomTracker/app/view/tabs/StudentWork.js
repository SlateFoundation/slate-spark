/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.tabs.StudentWork', {
    extend: 'Ext.Container',
    xtype: 'spark-tabs-studentwork',
    requires: [
        'SparkClassroomTeacher.view.tabs.studentwork.Learn',
        'SparkClassroomTeacher.view.tabs.studentwork.Conference',
        'SparkClassroomTeacher.view.tabs.studentwork.Apply'
    ],

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
                                        xtype: 'spark-tabs-studentwork-learn'
                                    },
                                    {
                                        xtype: 'spark-tabs-studentwork-conference'
                                    },
                                    {
                                        xtype: 'spark-tabs-studentwork-apply'
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