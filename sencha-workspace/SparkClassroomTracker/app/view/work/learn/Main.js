/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.learn.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-learn',
    requires: [
        'SparkClassroomTeacher.view.work.learn.AssignmentGrid'
    ],

    config: {
        title: 'Learn &amp; Practice',
        items: [
            {
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        flex: 1,
                        items: [
                            {
                                xtype: 'spark-work-learn-assignmentgrid'
                            },
                            {
                                xtype: 'component',
                                html: 'Standard 2'
                            },
                            {
                                xtype: 'component',
                                html: 'Standard 1'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        width: '30%',
                        layout: 'vbox',
                        items: [
                            {
                                xtype: 'component',
                                html: 'required learns'
                            },
                            {
                                xtype: 'component',
                                html: 'mastery score'
                            },
                            {
                                xtype: 'formpanel',
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        placeHolder: 'Subject'
                                    },
                                    {
                                        xtype: 'textareafield',
                                        placeHolder: 'Message'
                                    },
                                    {
                                        xtype: 'fieldset',
                                        label: 'To',
                                        items: [
                                            {
                                                xtype: 'radiofield',
                                                label: 'Alexandra W'
                                            },
                                            {
                                                xtype: 'radiofield',
                                                label: 'Current Standard'
                                            },
                                            {
                                                xtype: 'radiofield',
                                                label: 'All in group'
                                            },
                                            {
                                                xtype: 'radiofield',
                                                label: 'All in Conference'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Log'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
});