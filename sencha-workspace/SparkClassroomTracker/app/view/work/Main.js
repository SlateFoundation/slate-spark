/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work',
    requires: [
        'SparkClassroomTeacher.view.work.learn.Main',
        'SparkClassroomTeacher.view.work.conference.Main',
        'SparkClassroomTeacher.view.work.apply.Main',
        'SparkClassroomTeacher.view.work.assess.Main'
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
                                        xtype: 'spark-work-learn'
                                    },
                                    {
                                        xtype: 'spark-work-conference'
                                    },
                                    {
                                        xtype: 'spark-work-apply'
                                    },
                                    {
                                        xtype: 'spark-work-assess'
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